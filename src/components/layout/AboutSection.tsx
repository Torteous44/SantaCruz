import React from "react";
import { AboutSectionProps } from "../../types";

/**
 * About section component for displaying information about the archive
 * Redesigned with a minimal, boxy, alternative layout
 */
const AboutSection: React.FC<AboutSectionProps> = ({ isOpen, content }) => {
  return (
    <section className={`about-section ${isOpen ? "open" : "closed"}`}>
      <div className="about-content">
        <div className="about-left">
          <div className="about-main">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

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

          <div className="about-rules">
            <div className="about-rules-title">
              <h3>RULES</h3>
            </div>
            <div className="about-rules-content">
              <ul>
                <li>Photos must meet a minimal aesthetic standard.</li>
                <li>Images should focus on the architecture and space.</li>
                <li>
                  Artistic interpretation is welcome, but clarity is essential.
                </li>
                <li>
                  Images will be reviewed by the site administrators before
                  being published.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
