import { storeData, storeDataJSON, getData, getDataJSON, removeData } from "./AsyncStorageFunctions";

const getCourseDetails = async () => { 
    try {
        let courseDetails = await getDataJSON("courseDetails") || []
        if(Array.isArray(courseDetails) && courseDetails.length){ // temporaly use
            await removeData("courseDetails");
        }
        return courseDetails;
    } catch (error) {
        alert(error);
    }
};

const setCourseDetails = async (courseDetails) => { 
    try {
        //await storeDataJSON("courseDetails", courseDetails); // temporaly use
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

export { getCourseDetails, setCourseDetails, };