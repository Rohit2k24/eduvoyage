// src/components/Advertisement.jsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Advertisement.css';
import Scholarships from '../../assets/scholarship.jpg';
import uni from '../../assets/university.jpg';
import comm from '../../assets/community.jpg';
import exp from '../../assets/expert.jpg';

const Advertisement = () => {
  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          interval={4000}
          showStatus={false}
        >
          <div>
            <img src={exp} alt="Ad 1" />
            <p className="legend">Get Expert Advice on International Studies</p>
          </div>
          <div>
            <img src={uni} alt="Ad 2" />
            <p className="legend">Connect with Prestigious Universities Globally</p>
          </div>
        </Carousel>
      </div>

      <div className="carousel-wrapper">
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          interval={4000}
          showStatus={false}
        >
          <div>
            <img src={Scholarships} alt="Ad 3" />
            <p className="legend">Learn About Scholarships and Financial Aid</p>
          </div>
          <div>
            <img src={comm} alt="Ad 4" />
            <p className="legend">Join Our Community of Global Learners</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Advertisement;
