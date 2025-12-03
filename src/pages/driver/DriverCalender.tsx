import React, { useMemo, useState } from "react";
import { Modal, Button, Row, Col, Card, Badge } from "react-bootstrap";

interface DriverCalenderEntry {
  date: string;
  status: "reserved" | "available" | "completed";
  note?: string;
}

interface Props {
  show: boolean;
  onHide: () => void;
  driverId: string | null;
  driverName?: string;
  availabilityData?: Record<string, DriverCalenderEntry[]>;
  themeColor?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DriverCalender: React.FC<Props> = ({
  show,
  onHide,
  driverId,
  driverName,
  availabilityData,
  themeColor = "#18575A",
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  console.log(setViewYear);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = driverId ? availabilityData?.[driverId] ?? [] : [];
  const entryMap = useMemo(() => {
    const m: Record<string, DriverCalenderEntry> = {};
    entries.forEach((e) => (m[e.date] = e));
    return m;
  }, [entries]);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarGrid = useMemo(() => {
    const firstWeekday = firstDayOfMonth.getDay();
    const prevMonthDays = firstWeekday;
    const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
    const grid: { date: Date; inCurrentMonth: boolean }[] = [];
    const start = new Date(viewYear, viewMonth, 1 - prevMonthDays);
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      grid.push({ date: d, inCurrentMonth: d.getMonth() === viewMonth });
    }
    return grid;
  }, [viewYear, viewMonth]);

  const isoDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const reservedColor = "#E4572E";
  const availableColor = "#3BB273";
  const completedColor = "#5B5B5B";
  const otherMonthColor = "#f8f9fa";

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="compact-modal">
      <Modal.Header
        closeButton
        style={{
          backgroundColor: themeColor,
          color: "white",
          padding: "10px 15px",
        }}
      >
        <Modal.Title style={{ fontSize: "1rem" }}>
          Availability — {driverName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "10px 15px" }}>
        <Row className="align-items-center mb-2">
          <Col xs={7}>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                variant="light"
                size="sm"
                onClick={() => setViewMonth(viewMonth - 1)}
                className="me-2 px-2 py-0"
              >
                -
              </Button>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {firstDayOfMonth.toLocaleString(undefined, {
                  month: "short",
                })}{" "}
                {viewYear}
              </div>
              <Button
                variant="light"
                size="sm"
                onClick={() => setViewMonth(viewMonth + 1)}
                className="ms-2 px-2 py-0"
              >
                -
              </Button>
            </div>
          </Col>
          <Col xs={5} className="text-end" style={{ fontSize: "0.75rem" }}>
            <Badge bg="light" text="dark" className="me-1">
              <span
                style={{
                  background: reservedColor,
                  width: 8,
                  height: 8,
                  display: "inline-block",
                  borderRadius: "50%",
                  marginRight: 3,
                }}
              />
              Reserved
            </Badge>
            <Badge bg="light" text="dark" className="me-1">
              <span
                style={{
                  background: availableColor,
                  width: 8,
                  height: 8,
                  display: "inline-block",
                  borderRadius: "50%",
                  marginRight: 3,
                }}
              />
              Avail.
            </Badge>
            <Badge bg="light" text="dark">
              <span
                style={{
                  background: completedColor,
                  width: 8,
                  height: 8,
                  display: "inline-block",
                  borderRadius: "50%",
                  marginRight: 3,
                }}
              />
              Done
            </Badge>
          </Col>
        </Row>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {WEEKDAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {calendarGrid.map(({ date, inCurrentMonth }) => {
            const iso = isoDate(date);
            const entry = entryMap[iso];
            const bg = !inCurrentMonth
              ? otherMonthColor
              : entry
                ? entry.status === "reserved"
                  ? reservedColor
                  : entry.status === "completed"
                    ? completedColor
                    : availableColor
                : "white";
            const text = inCurrentMonth ? (entry ? "white" : "black") : "#aaa";

            return (
              <div
                key={iso}
                onClick={() => inCurrentMonth && setSelectedDate(iso)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  textAlign: "center",
                  background: bg,
                  color: text,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  lineHeight: "40px",
                  cursor: inCurrentMonth ? "pointer" : "default",
                  transition: "0.2s",
                }}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-center">
          {selectedDate && entryMap[selectedDate]?.status === "reserved" ? (
            <Card className="p-2 border-0 shadow-sm">
              <strong style={{ color: themeColor }}>Trip on {selectedDate}</strong>
              <div style={{ fontSize: "0.9rem" }}>{entryMap[selectedDate].note}</div>
            </Card>
          ) : selectedDate && entryMap[selectedDate]?.status === "completed" ? (
            <Card className="p-2 border-0 shadow-sm bg-light">
              <strong style={{ color: completedColor }}>Completed on {selectedDate}</strong>
              <div style={{ fontSize: "0.85rem" }}>{entryMap[selectedDate].note}</div>
            </Card>
          ) : selectedDate ? (
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              Available on {selectedDate}.
            </div>
          ) : (
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              Tap a date to view details.
            </div>
          )}
        </div>
      </Modal.Body>


    </Modal>
  );
};

export default DriverCalender;
