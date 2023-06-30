const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((_err) => res.status(400).json("Unable to get info"));
};

const handleApiCall = (req, res) => {
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: "clarifai",
      app_id: "main",
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Key ${CLARIFAI_API_KEY}`,
    },
    body: raw,
  };

  fetch(
    `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
    requestOptions
  )
    .then((data) => data.json())
    .then((data) => res.json(data))
    .catch((_err) => res.status(400).json("Error calling API server"));
};

module.exports = { handleImage, handleApiCall };
