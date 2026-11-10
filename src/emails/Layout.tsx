import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Hr } from "@react-email/components";

export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "sans-serif", padding: "20px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#F07824", margin: "0" }}>ISOURCE</Text>
          </Section>
          {children}
          <Hr style={{ borderColor: "#e4e4e7", margin: "30px 0" }} />
          <Section style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#71717a" }}>© {new Date().getFullYear()} Isource Marketplace.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}