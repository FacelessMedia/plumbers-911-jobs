import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Plumbers 911",
  description:
    "How Plumbers 911 collects, uses, stores, and protects the personal information you provide when applying through plumbers911jobs.com.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 1, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-white/5 bg-navy-dark/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Plumbers 911"
              width={140}
              height={42}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-light">
            Legal
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-zinc-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-zinc-300 [&_a]:text-brand-light [&_a]:underline [&_a:hover]:text-brand">
          <section>
            <p className="leading-relaxed">
              Plumbers 911 (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) operates the website{" "}
              <a
                href="https://www.plumbers911jobs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                plumbers911jobs.com
              </a>{" "}
              and provides recruiting and placement services that connect
              service plumbers with contractor partners in the Chicago metro
              area. This Privacy Policy explains what information we collect,
              why we collect it, how we use it, who we share it with, and the
              rights you have over it. By submitting an application or
              otherwise providing information through our site, you confirm
              you have read and agreed to this policy.
            </p>
          </section>

          <Section id="information-we-collect" title="1. Information We Collect">
            <p>
              When you apply for a position through our site, you choose to
              provide us with the following Personally Identifiable Information
              (&ldquo;PII&rdquo;):
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <Bullet>
                <strong>Contact information</strong> &mdash; first and last
                name, email address, phone number.
              </Bullet>
              <Bullet>
                <strong>Professional information</strong> &mdash; years of
                plumbing experience, license type and (for apprentices) license
                start date, current employer (optional), availability to start.
              </Bullet>
              <Bullet>
                <strong>Free-text message</strong> &mdash; any additional
                information you choose to share in the &ldquo;Anything else we
                should know?&rdquo; field.
              </Bullet>
              <Bullet>
                <strong>Resume and supporting documents</strong> &mdash; any
                files you upload (PDF, Word documents, or images). These files
                may themselves contain additional PII such as your home
                address, prior work history, education, references, and other
                details you have chosen to include.
              </Bullet>
            </ul>
            <p className="mt-3">
              We also automatically collect minimal technical information that
              is required for the website to function (such as IP address and
              browser request timestamps for security and abuse-prevention
              purposes). We do not use third-party advertising trackers, set
              non-essential cookies, or run cross-site behavioral analytics on
              this site.
            </p>
            <p className="mt-3">
              We do <strong>not</strong> collect Social Security Numbers,
              government IDs, financial account information, or biometric data
              through this site. Please do not include any of those in your
              free-text fields or resume.
            </p>
            <p className="mt-3">
              We do not knowingly collect information from anyone under the age
              of 16.
            </p>
          </Section>

          <Section id="how-we-use" title="2. How We Use Your Information">
            <p>We use the information you provide to:</p>
            <ul className="mt-3 space-y-2 pl-5">
              <Bullet>
                Review your qualifications and assess your suitability for
                available plumbing positions.
              </Bullet>
              <Bullet>
                Contact you about your application (email, phone, or text).
              </Bullet>
              <Bullet>
                Share your information with our contractor partners (described
                below) so they can evaluate you for placement.
              </Bullet>
              <Bullet>
                Maintain a record of your application for follow-up if
                positions become available later.
              </Bullet>
              <Bullet>
                Comply with our legal and regulatory obligations.
              </Bullet>
            </ul>
            <p className="mt-3">
              We do not sell your information. We do not share it with
              advertisers or use it for marketing unrelated to recruiting.
            </p>
          </Section>

          <Section id="who-we-share-with" title="3. Who We Share Your Information With">
            <p>We share your information only with:</p>
            <ul className="mt-3 space-y-2 pl-5">
              <Bullet>
                <strong>Plumbers 911 contractor partners.</strong> The whole
                point of applying through us is so we can match you with one
                of our partner plumbing contractors. When we believe you may
                be a fit for a partner&rsquo;s open role, we share your
                application materials (including resume) with that partner so
                they can evaluate and contact you. By applying, you authorize
                us to do this.
              </Bullet>
              <Bullet>
                <strong>Service providers we rely on to operate the
                business.</strong> Specifically: HighLevel (also known as
                LeadConnector / GoHighLevel) for our customer-relationship
                management (CRM) system and email delivery, Mailgun for
                outbound email transport, Google Workspace for our staff
                inboxes, and Vercel for website hosting. These providers
                process your data on our behalf under their own security and
                privacy commitments and are not permitted to use it for their
                own marketing purposes.
              </Bullet>
              <Bullet>
                <strong>Legal authorities,</strong> if we are required to
                disclose information to comply with a lawful subpoena, court
                order, or other legal process; or to protect our rights or
                others&rsquo; safety.
              </Bullet>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information.
            </p>
          </Section>

          <Section id="how-we-store" title="4. How We Store and Protect Your Information">
            <p>
              Your application data and uploaded files are stored inside our
              CRM (HighLevel), where they are encrypted in transit (TLS) and
              at rest. Access is limited to authorized members of our
              recruiting team. The information you submit travels from this
              website to our CRM over an encrypted HTTPS connection.
            </p>
            <p className="mt-3">
              While we use commercially reasonable safeguards to protect your
              information, no method of electronic storage or transmission is
              ever 100% secure. We cannot guarantee absolute security. If we
              ever become aware of a security incident affecting your
              information, we will notify affected applicants in accordance
              with applicable law.
            </p>
          </Section>

          <Section id="retention" title="5. How Long We Keep Your Information">
            <p>
              We retain your application information for as long as we have a
              recruiting relationship with you, plus a reasonable period
              afterward in case suitable positions open up.
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <Bullet>
                <strong>Active applicants:</strong> retained while we are
                actively considering you, plus up to 24 months from your last
                interaction with us.
              </Bullet>
              <Bullet>
                <strong>Placed candidates:</strong> if you are hired by one of
                our contractor partners through us, we keep records of the
                placement for as long as needed to administer the contractor
                relationship and meet legal recordkeeping requirements.
              </Bullet>
              <Bullet>
                <strong>Withdrawn or rejected applicants:</strong> retained
                for up to 24 months for follow-up consideration and to
                document our hiring decisions, then deleted or anonymized.
              </Bullet>
            </ul>
            <p className="mt-3">
              You may ask us to delete your information sooner. See &ldquo;Your
              Rights&rdquo; below.
            </p>
          </Section>

          <Section id="your-rights" title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-2 pl-5">
              <Bullet>
                <strong>Access</strong> the information we hold about you.
              </Bullet>
              <Bullet>
                <strong>Correct</strong> any information that is inaccurate or
                out of date.
              </Bullet>
              <Bullet>
                <strong>Delete</strong> your information (the &ldquo;right to be
                forgotten&rdquo;), subject to legal recordkeeping
                obligations.
              </Bullet>
              <Bullet>
                <strong>Withdraw your consent</strong> at any time. After
                withdrawal we will stop sharing your information with new
                contractor partners. We may retain a record of your prior
                application and any placements already made.
              </Bullet>
              <Bullet>
                <strong>Opt out of communications</strong> by replying STOP to
                a text, clicking unsubscribe in an email, or contacting us
                directly.
              </Bullet>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:apply@plumbers911jobs.com">
                apply@plumbers911jobs.com
              </a>{" "}
              from the email address you used to apply, or call us. We will
              respond within 30 days.
            </p>
          </Section>

          <Section id="cookies" title="7. Cookies and Tracking">
            <p>
              This website uses only the minimum essential cookies required for
              the site to function. We do not use third-party advertising
              cookies or cross-site behavioral tracking pixels. We may use
              basic, aggregate analytics to understand how the site is used
              (e.g. which pages are most visited), but these analytics do not
              identify you personally.
            </p>
          </Section>

          <Section id="state-rights" title="8. State and Federal Privacy Rights">
            <p>
              Depending on where you live, you may have additional rights
              under state law (for example, the Illinois Personal Information
              Protection Act, the California Consumer Privacy Act, or the
              Colorado Privacy Act). Where those laws apply to us, we will
              honor the rights they grant you, including the right to know
              what personal information we have collected about you and to
              request deletion. Contact us using the email above to make any
              such request.
            </p>
            <p className="mt-3">
              We are an equal opportunity recruiter and do not discriminate
              based on race, color, religion, sex, sexual orientation, gender
              identity, national origin, age, disability, veteran status, or
              any other protected category.
            </p>
          </Section>

          <Section id="changes" title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time as our
              practices evolve or as required by law. When we make material
              changes, we will update the &ldquo;Last updated&rdquo; date at
              the top of this page and, where appropriate, notify you by
              email. Your continued use of the site or submission of new
              information after the update constitutes acceptance of the
              updated policy.
            </p>
          </Section>

          <Section id="contact" title="10. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, the
              information we hold about you, or how to exercise your rights,
              please contact us:
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-navy-light/40 p-5">
              <p className="font-medium text-white">Plumbers 911 &mdash; Privacy</p>
              <p className="mt-1 text-sm text-zinc-400">Chicago, IL</p>
              <a
                href="mailto:apply@plumbers911jobs.com"
                className="mt-3 inline-flex items-center gap-2 text-sm text-brand-light hover:text-brand"
              >
                <Mail className="h-4 w-4" />
                apply@plumbers911jobs.com
              </a>
            </div>
          </Section>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <Link
            href="/#apply"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
          >
            Back to Application
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-2 before:absolute before:-left-3 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-light">
      {children}
    </li>
  );
}
