import React from "react";
import { AboutSectionProps } from "../../types";

/**
 * About section component for displaying information about the archive
 */
const AboutSection: React.FC<AboutSectionProps> = ({ isOpen, content }) => {
  return (
    <section className={`about-section ${isOpen ? "open" : "closed"}`}>
      <div className="about-content">
        <div className="about-left">
          <h2>ABOUT</h2>
          {content.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="about-disclaimer">
            <h3>DISCLAIMER</h3>
            <p>
              All content uploaded here remains the property of the creator. By
              uploading images to the website, you are allowing us the use of
              these images to create a crowdsourced image of the Santa Cruz
              building, and allow us to display the images in this context.
            </p>
            <p>
              We will not use these images for any other purpose. We cannot be
              held responsible for the content of any of the images or the
              accuracy of any of the information users upload. Please avoid
              uploading photographs of people without their permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
