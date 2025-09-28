import React, { useState, useRef, useEffect } from "react";
import "../Styling/SearchSection.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api";

gsap.registerPlugin(ScrollTrigger);

export default function SearchSection() {
  const [searchText, setSearchText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const recognitionRef = useRef(null);
  const sectionRef = useRef(null); // Ref for ScrollTrigger

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchText.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await api.get(`/search/?q=${searchText}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search failed!", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  // GSAP ScrollTrigger animation
  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(sectionRef.current.querySelectorAll(".search-container > *"), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  const startMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file.name);
  };

  const clearText = () => setSearchText("");

  return (
    <section className="search-section" ref={sectionRef}>
      <div className="search-container">
        <img src="/Logo.svg" alt="Logo" />
        <p className="search-subtitle">Your gateway to smarter farming</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search crops, tools, tips..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {searchText && (
            <button className="icon-btn" title="Clear Text" onClick={clearText}>
              <span style={{ fontWeight: "bold" }}>×</span>
            </button>
          )}

          <button className="icon-btn" title="Voice Search" onClick={startMic}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
              <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
            </svg>
          </button>

          <label className="icon-btn" title="Upload Image">
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.773a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
            </svg>
          </label>
        </div>

        {uploadedFile && <p className="uploaded-file">Uploaded: {uploadedFile}</p>}

        <div className="search-results">
          {isSearching && <p>Searching...</p>}
          {!isSearching && searchResults &&
            Object.entries(searchResults).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="search-category">
                  <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                  <ul>
                    {items.map((item) => (
                      <li key={`${category}-${item.id}`}>
                        <h3>{item.title || item.name}</h3>
                        <p>{item.content || item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))
          }
          {!isSearching && searchResults &&
            !Object.values(searchResults).some(items => items.length > 0) &&
            searchText.trim() && (
            <p>No results found for "{searchText}"</p>
          )}
        </div>
      </div>
    </section>
  );
}
