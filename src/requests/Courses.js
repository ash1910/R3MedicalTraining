import { R3ClientWithoutAuth } from "../clients/R3Client";

const course_endpoint = "ps-event/v1/events";
const course_detail_endpoint = "ps-event/v1/events/";

const getCourses = () => {
  return R3ClientWithoutAuth.get(course_endpoint);
};

const getCourseDetail = (id, user_id) => {
  return R3ClientWithoutAuth.get(`${course_detail_endpoint}${id}`,
    { 
      user_id: user_id,
    }
  );
};

export { getCourses, getCourseDetail };
