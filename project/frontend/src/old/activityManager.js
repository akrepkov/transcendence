const ActivityManager = (function () {

    let practicePong = false;
    return {
        setPracticePong() {
            practicePong = true;
        },
        unsetPracticePong() {
            practicePong = false;
        },
        getPracticePong() {
            return practicePong;
        }
    }
})();

export default ActivityManager;

//NOT USING????????????????????????????????TODO