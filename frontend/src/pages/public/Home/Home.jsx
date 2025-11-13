import React from "react";
import Header from "../../../components/common/Layout/Header";
import Hero from "./components/Hero";
import WriterCTA from "./components/WriterCTA";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WriterCTA />
      </main>
    </div>
  );
};

export default Home;
