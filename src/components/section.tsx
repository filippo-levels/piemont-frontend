import Link from "next/link";
import Image from "next/image";

export function Section() {
  return (
    <header className="container flex items-center justify-center py-4">
      <Link href="/" className="flex items-center gap-3" />
      <Image src="/images/TESTO-NERO.png" alt="logo" width={250} height={500} />
    </header>
  );
}
