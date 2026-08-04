export const success = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message,
    body: data
  });
};

export const error400 = (res, message) => {
  return res.status(400).json({
    success: false,
    message
  });
};

export const error401 = (res, message) => {
  return res.status(401).json({
    success: false,
    message
  });
};

export const error500 = (res, message) => {
  return res.status(500).json({
    success: false,
    message
  });
};
