// src/Home.jsx

import React from 'react';

import styles from './home.module.css';

import { motion } from 'framer-motion';

import { FaGlobeAmericas, FaUniversity, FaUserGraduate, FaHandshake } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import Header from '../Header/Header';



const Home = () => {

  return (

    <>

      <Header />

      <div className={styles.homepage}>

        <section className={styles.heroSection}>

          <div className={styles.heroContent}>

            <motion.h1 

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8 }}

            >

              Your Gateway to Global Education

            </motion.h1>

            <motion.p

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.2 }}

            >

              Discover world-class universities and shape your international academic journey

            </motion.p>

            <motion.div 

              className={styles.heroCTA}

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.4 }}

            >

              <Link to="/register" className={styles.primaryButton}>Start Your Journey</Link>

              <Link to="/colleges" className={styles.secondaryButton}>Explore Universities</Link>

            </motion.div>

          </div>

          <div className={styles.heroImage}></div>

        </section>



        <section className={styles.featuresSection}>

          <h2>Why Choose Us?</h2>

          <div className={styles.featuresGrid}>

            <motion.div 

              className={styles.featureCard}

              whileHover={{ y: -10 }}

              transition={{ type: "spring", stiffness: 300 }}

            >

              <FaGlobeAmericas className={styles.featureIcon} />

              <h3>Global Reach</h3>

              <p>Access to prestigious universities across multiple countries</p>

            </motion.div>

            <motion.div 

              className={styles.featureCard}

              whileHover={{ y: -10 }}

              transition={{ type: "spring", stiffness: 300 }}

            >

              <FaUniversity className={styles.featureIcon} />

              <h3>Verified Institutions</h3>

              <p>All partner universities are accredited and thoroughly vetted</p>

            </motion.div>

            <motion.div 

              className={styles.featureCard}

              whileHover={{ y: -10 }}

              transition={{ type: "spring", stiffness: 300 }}

            >

              <FaUserGraduate className={styles.featureIcon} />

              <h3>Student Success</h3>

              <p>Comprehensive support from application to graduation</p>

            </motion.div>

            <motion.div 

              className={styles.featureCard}

              whileHover={{ y: -10 }}

              transition={{ type: "spring", stiffness: 300 }}

            >

              <FaHandshake className={styles.featureIcon} />

              <h3>Easy Process</h3>

              <p>Streamlined application and enrollment procedures</p>

            </motion.div>

          </div>

        </section>

        <section className={styles.collegeSection}>
          <div className={styles.collegeContent}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              For Universities and Colleges
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join our global network of educational institutions. Expand your reach and connect with international students.
            </motion.p>
            <motion.div 
              className={styles.collegeActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/college-register" className={styles.collegeRegisterButton}>
                Register Your Institution
              </Link>
            </motion.div>
          </div>
        </section>

        <section className={styles.ctaSection}>

          <div className={styles.ctaContent}>

            <h2>Ready to Begin Your International Education Journey?</h2>

            <p>Join thousands of students who have successfully started their global education through our platform</p>

            <Link to="/register" className={styles.ctaButton}>Get Started Today</Link>

          </div>

        </section>



        <section className={styles.testimonialSection}>

          <h2>Student Success Stories</h2>

          <div className={styles.testimonialGrid}>

            <div className={styles.testimonialCard}>

              <p>"The platform made my dream of studying abroad a reality. The process was smooth and well-guided."</p>

              <div className={styles.testimonialAuthor}>

                <span>Sarah Johnson</span>

                <small>University of Toronto</small>

              </div>

            </div>

            <div className={styles.testimonialCard}>

              <p>"I got accepted into my dream university thanks to the comprehensive support and guidance."</p>

              <div className={styles.testimonialAuthor}>

                <span>Michael Chen</span>

                <small>University of Melbourne</small>

              </div>

            </div>

            <div className={styles.testimonialCard}>

              <p>"The application process was straightforward and the team was always there to help."</p>

              <div className={styles.testimonialAuthor}>

                <span>Emma Watson</span>

                <small>University of Oxford</small>

              </div>

            </div>

          </div>

        </section>

      </div>

    </>

  );

};



export default Home;


