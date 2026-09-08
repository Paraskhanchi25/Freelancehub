import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./PostJob.css";

function PostJob() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your job has been posted!");
  };

  return (
    <>
      <Navbar />

      <section className="post-job">

        <h1>Post a Job</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Job title"
            required
          />

          <textarea
            placeholder="Describe your project"
            required
          ></textarea>

          <input
            type="text"
            placeholder="Skills required"
            required
          />

          <input
            type="number"
            placeholder="Budget ₹"
            required
          />

          <button type="submit">
            Post Job
          </button>

        </form>

      </section>

      <Footer />
    </>
  );
}

export default PostJob;