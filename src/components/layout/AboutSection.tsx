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

          <div className="about-contact">
            <p>Any suggestions or corrections are welcome, please contact:</p>
            <p>mail [at] santa-cruz-archive [dot] net</p>
          </div>
        </div>

        <div className="about-right">
          <div className="colofon">
            <h3>COLOFON</h3>
            <p>
              This project was initiated by
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="javascript:void(0)">Student Name</a>, an alumnus of IE
              University, and
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="javascript:void(0)">Professor Name</a>.
            </p>

            <h4>Thanks to:</h4>
            <ul>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="javascript:void(0)">Name A</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="javascript:void(0)">Name B</a>
              </li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li>
                <a href="javascript:void(0)">Name C</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
