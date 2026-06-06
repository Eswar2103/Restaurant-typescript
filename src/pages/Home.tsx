import { Navigate } from "react-router-dom";

function Home() {
  return <Navigate to="/restaurants" replace />;
}

export default Home;
