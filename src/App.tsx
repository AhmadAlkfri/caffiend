import Layout from "./components/Layout"
import Hero from "./components/Hero"
import CoffeeForm from "./components/CoffeeForm"
import Stats from "./components/Stats"
import Hisotry from "./components/History"

function App() {

  const isAuthenticated = true

  const authenticatedContent = (
    <>
      <Stats />
      <Hisotry />
    </>
  )

  return (
    <Layout>
      <Hero />
      <CoffeeForm />
      {isAuthenticated && (authenticatedContent)}
    </Layout>
)
}

export default App
