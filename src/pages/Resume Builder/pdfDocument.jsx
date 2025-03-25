
import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import {
  ResumeContentStyles,
  EducationExperienceStyles,
  CustomStyles
} from '../../Styles/pdfStyles';

// import PinIcon from '../../assets/Icons/pin.png';
// import MailIcon from '../../assets/Icons/mail.png';
// import PhoneIcon from '../../assets/Icons/phone.png';
// import LinkIcon from '../../assets/Icons/link.png';

const pdfDocument = ({ resumeData }) => {
  const { personalInfo, education = [], experience = [], customSections = [] } = resumeData;

  const renderContactItem = (icon, value) =>
    value ? (
      <View style={ResumeContentStyles.contactItem}>
        <Image src={icon} style={ResumeContentStyles.contactIcon} />
        <Text>{value}</Text>
      </View>
    ) : null;

  const renderBulletPoints = (points = []) =>
    points.filter(p => p && p.trim()).map((point, index) => (
      <Text key={index} style={EducationExperienceStyles.bulletPoint}>•   {point}</Text>
    ));

  // Filter empty entries
  const filteredEducation = education.filter(
    (edu) =>
      edu.school || edu.degree || edu.fieldOfStudy || edu.bulletPoints?.some(bp => bp?.trim())
  );

  const filteredExperience = experience.filter(
    (exp) =>
      exp.title || exp.company || exp.bulletPoints?.some(bp => bp?.trim())
  );

  const filteredCustomSections = customSections
    .map(section => ({
      ...section,
      entries: section.entries.filter(entry =>
        entry.title || entry.subtitle || entry.bulletPoints?.some(bp => bp?.trim())
      )
    }))
    .filter(section => section.entries.length > 0);

  return (
    <Document>
      <Page size="A4" style={ResumeContentStyles.resumeDocument}>
        {/* Header */}
        <View style={ResumeContentStyles.resumeHeader}>
          <Text style={ResumeContentStyles.resumeName}>
            {personalInfo?.name || 'Your Name'}
          </Text>
          <View style={ResumeContentStyles.resumeContactInfo}>
            {renderContactItem(PinIcon, personalInfo?.location)}
            {renderContactItem(MailIcon, personalInfo?.email)}
            {renderContactItem(PhoneIcon, personalInfo?.phone)}
            {renderContactItem(LinkIcon, personalInfo?.linkedin)}
          </View>
        </View>

        {/* Education */}
        {filteredEducation.length > 0 && (
          <View style={ResumeContentStyles.resumeSection}>
            <Text style={ResumeContentStyles.sectionTitle}>Education</Text>
            {filteredEducation.map((edu, i) => (
              <View key={i} style={EducationExperienceStyles.educationEntry}>
                <View style={EducationExperienceStyles.entryHeader}>
                  <View style={EducationExperienceStyles.mainDetails}>
                    <Text style={EducationExperienceStyles.degree}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </Text>
                    <Text style={EducationExperienceStyles.school}>{edu.school}</Text>
                  </View>
                  <View style={EducationExperienceStyles.dateLocation}>
                    <Text style={EducationExperienceStyles.dateRange}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                    <Text style={EducationExperienceStyles.location}>{edu.location}</Text>
                  </View>
                </View>
                {renderBulletPoints(edu.bulletPoints)}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {filteredExperience.length > 0 && (
          <View style={ResumeContentStyles.resumeSection}>
            <Text style={ResumeContentStyles.sectionTitle}>Experience</Text>
            {filteredExperience.map((exp, i) => (
              <View key={i} style={EducationExperienceStyles.experienceEntry}>
                <View style={EducationExperienceStyles.entryHeader}>
                  <View style={EducationExperienceStyles.mainDetails}>
                    <Text style={EducationExperienceStyles.jobTitle}>{exp.title}</Text>
                    <Text style={EducationExperienceStyles.company}>{exp.company}</Text>
                  </View>
                  <View style={EducationExperienceStyles.dateLocation}>
                    <Text style={EducationExperienceStyles.dateRange}>
                      {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                    </Text>
                    <Text style={EducationExperienceStyles.location}>{exp.location}</Text>
                  </View>
                </View>
                {renderBulletPoints(exp.bulletPoints)}
              </View>
            ))}
          </View>
        )}

        {/* Custom Sections */}
        {filteredCustomSections.map((section, i) => (
          <View key={i} style={ResumeContentStyles.resumeSection}>
            <Text style={ResumeContentStyles.sectionTitle}>{section.title || 'Custom Section'}</Text>
            {section.entries.map((entry, j) => (
              <View key={j} style={CustomStyles.customEntry}>
                <View style={EducationExperienceStyles.entryHeader}>
                  <View style={EducationExperienceStyles.mainDetails}>
                    <Text style={CustomStyles.customTitle}>{entry.title}</Text>
                    <Text style={CustomStyles.customSubtitle}>{entry.subtitle}</Text>
                  </View>
                  <View style={EducationExperienceStyles.dateLocation}>
                    <Text style={EducationExperienceStyles.dateRange}>
                      {entry.startDate} - {entry.isCurrentPosition ? 'Present' : entry.endDate}
                    </Text>
                    <Text style={EducationExperienceStyles.location}>{entry.location}</Text>
                  </View>
                </View>
                {renderBulletPoints(entry.bulletPoints)}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default pdfDocument;
