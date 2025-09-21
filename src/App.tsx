import { useState } from "react"
import Layout from "./components/Layout"
import Hero from "./components/Hero"
import CoffeeForm from "./components/CoffeeForm"
import Stats from "./components/Stats"
import Hisotry from "./components/History"
import { useAuth } from "./context/AuthContext"


function App() {
  const {globalUser, globalData, isLoading} = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!(Object.keys(globalData || {}).length)
  const [showModal, setShowModal] = useState(false)

  const authenticatedContent = (
    <>
      <Stats />
      <Hisotry />
    </>
  )

  return (
    <Layout showModal={showModal} setShowModal={setShowModal}>
      <Hero />
      <CoffeeForm setShowModal={setShowModal} isAuthenticated={isAuthenticated} />
      {(isAuthenticated && isLoading) && (<p>Loading Data...</p>)}
      {(isAuthenticated && isData) && (authenticatedContent)}
    </Layout>
)
}

export default App
