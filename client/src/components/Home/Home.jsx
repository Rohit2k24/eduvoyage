// src/Home.jsx
import React from 'react';
import styles from './home.module.css';
import Header from '../Header/Header';
import { FaGlobeAmericas, FaGraduationCap, FaUniversity, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className={styles.homepage}>
      <Header />
      
      <main className={styles.maincontent}>
        <section className={styles.herosection}>
          <motion.div 
            className={styles.herocontent}
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <h1>Transform Your Future with Global Education</h1>
            <p>Discover world-class universities and programs tailored to your aspirations</p>
            <div className={styles.herobuttons}>
              <button className="primary-button">Explore Programs</button>
              <button className="secondary-button">Learn More</button>
            </div>
          </motion.div>
        </section>

        <section className={styles.statssection}>
          <div className={styles.statcontainer}>
            <div className={styles.statitem}>
              <span className={styles.statnumber}>500+</span>
              <span className={styles.statlabel}>Universities</span>
            </div>
            <div className={styles.statitem}>
              <span className={styles.statnumber}>50k+</span>
              <span className={styles.statlabel}>Students</span>
            </div>
            <div className={styles.statitem}>
              <span className={styles.statnumber}>100+</span>
              <span className={styles.statlabel}>Countries</span>
            </div>
            <div className={styles.statitem}>
              <span className={styles.statnumber}>1000+</span>
              <span className={styles.statlabel}>Programs</span>
            </div>
          </div>
        </section>

        <section className={styles.featuressection}>
          <h2>Why Choose EduVoyage?</h2>
          <div className={styles.featuresgrid}>
            <div className={styles.featurecard}>
              <FaGlobeAmericas className={styles.featureicon}/>
              <h3>Global Reach</h3>
              <p>Access to prestigious institutions worldwide</p>
            </div>
            <div className={styles.featurecard}>
              <FaGraduationCap className={styles.featureicon} />
              <h3>Expert Guidance</h3>
              <p>Personalized counseling for your academic journey</p>
            </div>
            <div className={styles.featurecard}>
              <FaUniversity className={styles.featureicon} />
              <h3>Top Universities</h3>
              <p>Partnerships with leading educational institutions</p>
            </div>
            <div className={styles.featurecard}>
              <FaUsers className={styles.featureicon} />
              <h3>Student Community</h3>
              <p>Connect with peers from around the world</p>
            </div>
          </div>
        </section>

        <section className={styles.ctasection}>
          <div className={styles.ctacontent}>
            <h2>Ready to Begin Your Journey?</h2>
            <p>Take the first step towards your international education</p>
            <button className={styles.ctabutton}>Get Started</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
