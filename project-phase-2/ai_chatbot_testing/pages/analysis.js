import AnalysisReport from '../components/AnalysisReport';
import styles from "@/styles/TestCases.module.css";

export default function Analysis() {
  return (
    <div className={styles.testCases}>
      <AnalysisReport />
    </div>
  );
}