export function getCanvasContext(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

export function putMessageOnScoreField(scoreFieldId: string, message: string) {
  const scoreField = document.getElementById(scoreFieldId);
  if (scoreField) {
    scoreField.innerHTML = message;
  } else {
    console.warn(`Score field with ID ${scoreFieldId} not found.`);
  }
}
