import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to Secure Storage</h1>
        <p className="mt-2">Securely store and share your files.</p>
      </div>
    </div>
  );
}
