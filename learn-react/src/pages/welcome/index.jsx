import About from "./About.jsx";
import Hero from "./Hero.jsx";
import Testimonials from "./Testimonials.jsx";
import Demo from "./Demo.jsx";
import "../../styles/welcome.css"

export  default function welcome (){
    return (
        <main id='home'>
            <Hero/>
            <About/>
            <section className='projects' id='projects'>
                <Demo/>
            </section>
            <section className='rest'></section>
        </main>
    )

}