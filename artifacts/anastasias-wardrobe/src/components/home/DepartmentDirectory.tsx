import React from "react";
import Link from "next/link";
import Image from "next/image";

export function DepartmentDirectory() {
  const departments = [
    {
      title: "Girls",
      subtitle: "Little adventures, ages 2–12",
      href: "/category/girls-2-12",
      image: "/images/girls.png",
    },
    {
      title: "Teens",
      subtitle: "Finding a style, ages 13–17",
      href: "/category/teens-13-17",
      image: "/images/teens.png",
    },
    {
      title: "Women",
      subtitle: "Everyday, beautifully considered",
      href: "/category/women",
      image: "/images/women.png",
    },
  ];

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#F8F5EF",
        borderTop: "1px solid #D8CFC6",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingLeft: "48px",
          paddingRight: "48px",
        }}
      >
        {/* Section Heading */}
        <div style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "44px",
              color: "#302B28",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Find your corner of the wardrobe
          </h2>
        </div>

        {/* 3-column department grid */}
        <div className="aw-dept-grid">
          {departments.map((dept) => (
            <Link
              key={dept.title}
              href={dept.href}
              className="aw-dept-card"
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#FFFDFA",
                border: "1px solid #D8CFC6",
                overflow: "hidden",
                textDecoration: "none",
                transition: "border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "360px",
                  backgroundColor: "#EAE4D9",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                />
              </div>

              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "26px",
                    color: "#302B28",
                    lineHeight: 1.2,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{dept.title}</span>
                  <span style={{ fontSize: "20px" }}>→</span>
                </h3>
                <p style={{ fontSize: "14px", color: "#69615B", lineHeight: 1.45, margin: 0 }}>
                  {dept.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .aw-dept-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
        }
        .aw-dept-card:hover {
          border-color: #713A48;
        }
        .aw-dept-card:hover img {
          transform: scale(1.05);
        }
        .aw-dept-card:hover h3 {
          color: #713A48;
        }
        @media (max-width: 767px) {
          .aw-dept-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .aw-dept-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}
