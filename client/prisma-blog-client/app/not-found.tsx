import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto space-y-1 mt-10">
      <h2 className="text-center">Not Found</h2>
      <p className="text-center">Could not find requested resource</p>
      <p className="text-center">
        <Link href="/">Return Home</Link>
      </p>
    </div>
  );
}
