export const VIDEOS = {
  VIDEO_1: "https://res.cloudinary.com/dizbpr8pc/video/upload/v1790232320/5224-183786646_ohrfax.mp4",
  VIDEO_2: "https://res.cloudinary.com/dizbpr8pc/video/upload/v1790232318/48420-453832153_qwghqf.mp4",
  VIDEO_3: "https://res.cloudinary.com/dizbpr8pc/video/upload/v1790232309/1992-153555258_medium_jveewv.mp4",
  VIDEO_4:"https://res.cloudinary.com/dizbpr8pc/video/upload/v1790574015/4389357-uhd_3840_2024_30fps_sn0xep.mp4"
};

export const getVideoUrl = (key) => {
  return VIDEOS[key] || null;
};
