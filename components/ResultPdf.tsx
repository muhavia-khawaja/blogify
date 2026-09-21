'use client'

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

export interface StudentInfo {
  rollNo: string
  name: string
  fatherName: string
  regNo: string
  group: string
  institution: string
  status: string
  totalObtained: number
  totalMax: number
  percentage: string
  hasSupply: boolean
}

export interface SubjectItem {
  name: string
  p1: number
  p2: number
  practical: number
  total: number
  pass: string
  isFail: boolean
}

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },

  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottom: '1pt solid #cbd5e1',
    paddingBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  subtitle: {
    fontSize: 10,
    color: '#4f46e5',
    marginTop: 4,
  },

  sectionGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },

  infoBox: {
    width: '50%',
    padding: 4,
  },

  label: {
    fontSize: 8,
    color: '#64748b',
  },

  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 10,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  tableHeader: {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
  },

  colSub: {
    width: '35%',
    padding: 5,
  },

  colNum: {
    width: '13%',
    padding: 5,
    textAlign: 'center',
  },

  colStatus: {
    width: '13%',
    padding: 5,
    textAlign: 'center',
  },

  footerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ff',
    fontWeight: 'bold',
  },
})

function ResultPdfDocument({
  studentInfo,
  subjects,
}: {
  studentInfo: StudentInfo
  subjects: SubjectItem[]
}) {
  return (
    <Document>
      <Page size='A4' style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>
            Board of Intermediate & Secondary Education
          </Text>

          <Text style={pdfStyles.subtitle}>WEB RESULT CARD</Text>
        </View>

        <View style={pdfStyles.sectionGrid}>
          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Candidate Name</Text>
            <Text style={pdfStyles.value}>{studentInfo.name}</Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Father&apos;s Name</Text>
            <Text style={pdfStyles.value}>{studentInfo.fatherName}</Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Roll No / Reg No</Text>
            <Text style={pdfStyles.value}>
              {studentInfo.rollNo} / {studentInfo.regNo}
            </Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Result Status</Text>
            <Text style={pdfStyles.value}>
              {studentInfo.status} ({studentInfo.percentage}%)
            </Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Group</Text>
            <Text style={pdfStyles.value}>{studentInfo.group}</Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>Institution</Text>
            <Text style={pdfStyles.value}>{studentInfo.institution}</Text>
          </View>
        </View>

        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <Text style={pdfStyles.colSub}>Subject</Text>
            <Text style={pdfStyles.colNum}>P-I</Text>
            <Text style={pdfStyles.colNum}>P-II</Text>
            <Text style={pdfStyles.colNum}>Prac</Text>
            <Text style={pdfStyles.colNum}>Total</Text>
            <Text style={pdfStyles.colStatus}>Status</Text>
          </View>

          {subjects.map((sub, index) => (
            <View style={pdfStyles.tableRow} key={`${sub.name}-${index}`}>
              <Text style={pdfStyles.colSub}>{sub.name}</Text>

              <Text style={pdfStyles.colNum}>{sub.p1 || '-'}</Text>

              <Text style={pdfStyles.colNum}>{sub.p2 || '-'}</Text>

              <Text style={pdfStyles.colNum}>{sub.practical || '-'}</Text>

              <Text style={pdfStyles.colNum}>{sub.total}</Text>

              <Text style={pdfStyles.colStatus}>{sub.pass}</Text>
            </View>
          ))}

          <View style={[pdfStyles.tableRow, pdfStyles.footerRow]}>
            <Text
              style={[
                pdfStyles.colSub,
                {
                  width: '61%',
                  textAlign: 'right',
                },
              ]}
            >
              Total Marks:
            </Text>

            <Text style={pdfStyles.colNum}>
              {studentInfo.totalObtained} / {studentInfo.totalMax}
            </Text>

            <Text style={pdfStyles.colStatus}>{studentInfo.percentage}%</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default function ResultPdf({
  studentInfo,
  subjects,
}: {
  studentInfo: StudentInfo
  subjects: SubjectItem[]
}) {
  return (
    <PDFDownloadLink
      document={
        <ResultPdfDocument studentInfo={studentInfo} subjects={subjects} />
      }
      fileName={`Result_${studentInfo.rollNo}.pdf`}
      className='w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm'
    >
      {({ loading }) => (
        <>
          <span>{loading ? 'Preparing PDF...' : 'Export as PDF'}</span>
        </>
      )}
    </PDFDownloadLink>
  )
}
