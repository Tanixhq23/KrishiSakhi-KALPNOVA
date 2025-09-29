import React, { useEffect, useRef, useState } from "react";
import "../Styling/FarmingAssistant.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api";

gsap.registerPlugin(ScrollTrigger);

const CropRecommendationForm = ({ setRecommendation, setFormData, formData }) => {

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/recommend-crop/", formData)
      .then((response) => {
        setRecommendation(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="crop-recommendation-form">
      <input
        type="number"
        name="N"
        placeholder="Nitrogen"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="P"
        placeholder="Phosphorus"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="K"
        placeholder="Potassium"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="temperature"
        placeholder="Temperature (°C)"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="humidity"
        placeholder="Humidity (%)"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="ph"
        placeholder="pH"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="rainfall"
        placeholder="Rainfall (mm)"
        onChange={handleChange}
        required
      />
      <button type="submit">Get Recommendation</button>
    </form>
  );
};

const TaskCompletionForm = ({ activity, onComplete, isCompleted }) => {
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(activity.id, notes, image);
  };

  if (isCompleted) {
    return <p className="task-completed">✅ Task Completed</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="task-completion-form">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes..."
      ></textarea>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Complete Task</button>
    </form>
  );
};

const ActivityTracker = ({ crop, userActivities, setUserActivities }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (crop) {
      api
        .get(`/farming-activities/?crop=${crop}`)
        .then((response) => {
          setActivities(response.data);
        })
        .catch((error) => {
          console.error("Error fetching farming activities:", error);
        });
    }

    if (localStorage.getItem('token')) { // Only fetch user activities if logged in
        api
          .get("/user-activities/")
          .then((response) => {
            setUserActivities(response.data.map((ua) => ua.activity.id));
          })
          .catch((error) => {
            console.error("Error fetching user activities:", error);
          });
    }
  }, [crop, setUserActivities]);

  const handleTaskCompletion = (activityId, notes, image) => {
    const formData = new FormData();
    formData.append("activity", activityId);
    formData.append("notes", notes);
    if (image) {
      formData.append("image", image);
    }

    api
      .post("/user-activities/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUserActivities([...userActivities, response.data.activity]);
      })
      .catch((error) => {
        console.error("Error completing task:", error);
      });
  };

  return (
    <div className="activity-tracker">
      <h3>{crop ? `Daily Activities for ${crop}` : "Daily Activities"}</h3>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <span>Day {activity.day}: {activity.task}</span>
              <span className={userActivities.includes(activity.id) ? "status completed" : "status todo"}>
                {userActivities.includes(activity.id) ? "Completed" : "To Do"}
              </span>
            </div>
            <p>{activity.instructions}</p>
            <TaskCompletionForm
              activity={activity}
              onComplete={handleTaskCompletion}
              isCompleted={userActivities.includes(activity.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FarmingAssistant() {
  const sectionRef = useRef(null);
  const [recommendation, setRecommendation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [userActivities, setUserActivities] = useState([]);
  const [recommendationAccepted, setRecommendationAccepted] = useState(false);

  useEffect(() => {
    if (sectionRef.current) {
      const elementsToAnimate = sectionRef.current.querySelectorAll(
        ".farming-title, .farming-location"
      );

      gsap.from(elementsToAnimate, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  const handleAcceptRecommendation = () => {
    const data = {
      ...formData,
      crop_name: recommendation.predicted_crop,
    };
    api
      .post("/accept-crop-recommendation/", data)
      .then((response) => {
        setUserActivities([response.data.activity.id]);
        setRecommendationAccepted(true);
      })
      .catch((error) => {
        console.error("There was an error accepting the recommendation!", error);
        console.log("Error response:", error.response);
      });
  };

  return (
    <section className="farming-assistant" ref={sectionRef}>
      <div className="farming-overlay">
        <h2 className="farming-title">Personal Farming Assistant</h2>
        {!showForm && !recommendation && (
          <button
            className="farming-button"
            onClick={() => setShowForm(true)}
          >
            Get Crop Recommendation →
          </button>
        )}

        {showForm && !recommendation && (
          <CropRecommendationForm setRecommendation={setRecommendation} setFormData={setFormData} formData={formData} />
        )}

        {recommendation && !recommendationAccepted && (
          <div>
            <h3>Recommended Crop: {recommendation.predicted_crop}</h3>
            <button onClick={handleAcceptRecommendation}>Accept Recommendation</button>
          </div>
        )}

        {(recommendationAccepted || (recommendation && !showForm)) && (
          <ActivityTracker crop={recommendation.predicted_crop} userActivities={userActivities} setUserActivities={setUserActivities} />
        )}
      </div>
    </section>
  );
}
