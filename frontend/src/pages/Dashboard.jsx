import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <FileUpload />
        <FileList />
      </div>
    </div>
  );
}
