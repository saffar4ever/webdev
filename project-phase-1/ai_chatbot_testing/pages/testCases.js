import TestCaseList from "@/components/TestCaseList";
import styles from "@/styles/TestCases.module.css";

export default function TestCases() {
  return (
    <div className={styles.testCases}>
      <TestCaseList />
    </div>
  );
}