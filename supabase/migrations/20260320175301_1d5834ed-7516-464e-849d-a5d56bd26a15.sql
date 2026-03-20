-- Create enums
CREATE TYPE public.app_role AS ENUM ('student', 'lecturer', 'admin');
CREATE TYPE public.complaint_status AS ENUM ('Pending', 'Under Review', 'In Progress', 'Resolved', 'Closed');
CREATE TYPE public.complaint_category AS ENUM ('Academic Issues', 'Facility Problems', 'Administrative Concerns', 'Hostel and Accommodation', 'Library Services', 'ICT Issues', 'Student Welfare', 'Other Matters');

-- User roles table first
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Complaints
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.complaint_category NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status public.complaint_status NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own complaints" ON public.complaints FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all complaints" ON public.complaints FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own complaints" ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any complaint" ON public.complaints FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Responses
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view responses to their complaints" ON public.responses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert responses" ON public.responses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-images', 'complaint-images', true);
CREATE POLICY "Anyone can view complaint images" ON storage.objects FOR SELECT USING (bucket_id = 'complaint-images');
CREATE POLICY "Auth users can upload complaint images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'complaint-images' AND auth.uid()::text = (storage.foldername(name))[1]);