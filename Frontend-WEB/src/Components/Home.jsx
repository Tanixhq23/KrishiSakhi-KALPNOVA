import Hero from '../Components/Hero'
import Stats from '../Components/Stats'
import SearchSection from '../Components/SearchSection'
import Services from '../Components/Services'
import FarmingAssistant from '../Components/FarmingAssistant'
import Contact from '../Components/Contact'
import NewsAndUpdates from '../Components/NewsAndUpdates'

const Home = () => {
    return (
        <>
            <Hero />
            <Stats/>
            <SearchSection/>
            <Services/>
            <FarmingAssistant/>
            <NewsAndUpdates/>
            <Contact/>
        </>
    )
}

export default Home