"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "summaries"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const summaries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(summaries);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Saved Summaries 📚
      </h1>

      {data.length === 0 ? (
        <p>No summaries yet.</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 mb-4 whitespace-pre-wrap"
          >
            {item.summary}
          </div>
        ))
      )}
    </main>
  );
}