import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const users = [
    { email: "admin@estam.edu", password: "admin123", name: "System Admin", role: "admin" },
    { email: "student@estam.edu", password: "student123", name: "Adebayo Chinedu", role: "student" },
    { email: "lecturer@estam.edu", password: "lecturer123", name: "Dr. Oluwaseun Balogun", role: "lecturer" },
  ];

  const results: string[] = [];

  for (const u of users) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((x: any) => x.email === u.email);
    if (found) {
      results.push(`${u.email} already exists`);
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name, role: u.role },
    });

    if (error) {
      results.push(`${u.email} error: ${error.message}`);
    } else {
      results.push(`${u.email} created`);

      // Wait for trigger to create profile, then insert sample complaints for student
      if (u.role === "student" && data.user) {
        await new Promise((r) => setTimeout(r, 1000));
        const categories = [
          "Academic Issues",
          "Facility Problems",
          "ICT Issues",
          "Hostel and Accommodation",
          "Library Services",
        ];
        const descriptions = [
          "The lecture hall projector in Block B Room 204 has been broken for 3 weeks. Multiple lecturers have complained about this issue.",
          "Water leakage in the main corridor of the Science building. The floor becomes slippery and dangerous when it rains.",
          "The campus Wi-Fi has been extremely slow and unreliable for the past month, affecting online research.",
          "Room 15B in the hostel has a broken window that hasn't been fixed despite multiple reports.",
          "Several important textbooks are missing from the library catalogue and haven't been replaced.",
        ];
        const statuses = ["Pending", "In Progress", "Resolved", "Pending", "Under Review"];

        for (let i = 0; i < 5; i++) {
          await supabase.from("complaints").insert({
            user_id: data.user.id,
            category: categories[i],
            description: descriptions[i],
            status: statuses[i],
          });
        }
        results.push("Sample complaints created for student");
      }
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
