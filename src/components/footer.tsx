import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-dark py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <Image
              src="/logo.png"
              alt="Plumbers 911"
              width={140}
              height={42}
              className="h-9 w-auto"
            />
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Connecting Chicago&apos;s top service plumbers with the
              highest-paying contractors in the metro area.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex items-center gap-6">
              <a
                href="mailto:Apply@Plumbers911Chicago.com"
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Apply@Plumbers911Chicago.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Phone className="h-4 w-4" />
              <span>Chicago, IL</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Plumbers 911 Chicago. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
