export function getChartColors() {
  const styles = getComputedStyle(document.documentElement);

  return {
    bg: styles.getPropertyValue("--color-bg").trim(),
    text: styles.getPropertyValue("--color-text").trim(),
    border: styles.getPropertyValue("--color-border").trim(),
  };
}
