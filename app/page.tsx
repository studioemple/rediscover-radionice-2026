import { RentlioBackground } from "@/components/RentlioBackground";
import { Header, Hero } from "@/components/Hero";
import { Workshops } from "@/components/Workshops";
import { RegisterForm } from "@/components/RegisterForm";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <RentlioBackground style={{ background: "#F3F3F3", overflowX: "clip" }}>
      <Header />
      <main>
        <Hero />
        <Workshops />
        <RegisterForm />
      </main>
      <Footer />
    </RentlioBackground>
  );
}
