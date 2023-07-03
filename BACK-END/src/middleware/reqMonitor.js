const reqMonitor = (req, res, next) => {
  const { rawHeaders, httpVersion, method, socket, url } = req;
  const { remoteAddress, remoteFamily } = socket;
  let data = new Date().toLocaleString("PT-br");
  res.on("finish", () =>
    console.log(
      "Req Data:",
      JSON.stringify({
        data,
        rawHeaders,
        httpVersion,
        method,
        remoteAddress,
        remoteFamily,
        url,
      })
    )
  );
  next();
};
export default reqMonitor;
