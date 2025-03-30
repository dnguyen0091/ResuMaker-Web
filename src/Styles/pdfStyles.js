
import { StyleSheet } from '@react-pdf/renderer';

export const ResumeContentStyles = StyleSheet.create({
  resumeDocument: {
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 90,
    paddingRight: 90,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.3
  },
  resumeHeader: {
    textAlign: 'center',
    borderBottom: '2pt solid #444',
    paddingBottom: 16,
    marginBottom: 36,
  },
  resumeName: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  resumeContactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  contactItemGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactSeparator: {
    marginHorizontal: 24,
    color: '#888',
    fontSize: 14,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  resumeSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    borderBottom: '1pt solid #999',
    paddingBottom: 8,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export const EducationExperienceStyles = StyleSheet.create({
  educationEntry: {
    marginBottom: 10,
  },
  experienceEntry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  mainDetails: {
    flex: 3,
  },
  dateLocation: {
    flex: 1,
    alignItems: 'flex-end',
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  school: {
    fontSize: 12,
    fontWeight: 'semibold',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    fontWeight: 'semibold',
    marginBottom: 2,
  },
  dateRange: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  location: {
    fontSize: 10,
    color: '#666',
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 2,
  },
});

export const CustomStyles = StyleSheet.create({
  customEntry: {
    paddingVertical: 2,
  },
  customTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  customSubtitle: {
    fontSize: 16,
    marginBottom: 8,
  }
});
