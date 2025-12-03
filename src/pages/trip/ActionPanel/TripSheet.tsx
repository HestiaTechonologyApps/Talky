// src/components/Trips/TripSheet.tsx

import { forwardRef } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

interface TripSheetProps {
    trip?: any;
}

const TripSheet = forwardRef<HTMLDivElement, TripSheetProps>(({ trip }, ref) => {

    return (
        <div ref={ref} id="trip-sheet">
            <Container
                fluid
                style={{
                    backgroundColor: "#ffffff",
                    fontFamily: "Arial, sans-serif",
                    color: "#000",
                    width: "210mm",
                    minHeight: "297mm",
                    padding: "10mm",
                }}
            >
                {/* Header with Logo and Title */}
                <div
                    style={{
                        backgroundColor: "#18575A",
                        padding: "15px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        {/* Logo placeholder - you can add actual logo here */}
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor: "#ffffff",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#18575A",
                            }}
                        >
                            LOGO
                        </div>
                        <div>
                            <h4 style={{ color: "#ffffff", margin: 0, fontWeight: "bold" }}>
                                MAK INTERNATIONAL
                            </h4>
                            <p style={{ color: "#ffffff", margin: 0, fontSize: "14px" }}>
                                   
                            </p>
                        </div>
                    </div>
                </div>
                
                <Row>
                    <Col xs={12}>
                    <p className="text-center" style={{ fontWeight: "bold", fontSize: "14px" }}>Trip Sheet</p>
                    </Col>
                </Row>
                {/* Trip Sheet Number and Date */}
                <Row className="mb-3">
                    <Col xs={6}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ fontWeight: "bold", fontSize: "14px" }}>Trip ID:</span>
                            <div
                                style={{
                                    border: "1px solid #000",
                                    padding: "5px 15px",
                                    minWidth: "100px",
                                    fontWeight: "bold",
                                }}
                            >
                                {trip?.tripOrderId || ""}
                            </div>
                        </div>
                    </Col>
                    <Col xs={6} style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                            <span style={{ fontWeight: "bold", fontSize: "14px" }}>Date:</span>
                            <div
                                style={{
                                    border: "1px solid #000",
                                    padding: "5px 15px",
                                    minWidth: "100px",
                                }}
                            >
                                {/* {formatDate(trip?.fromDate) || ""} */}
                                {new Date().toLocaleDateString("en-GB")} {/* Output: 03/11/2025 */}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Company Details */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Company Name:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}>

                        </div>
                        <span style={{ fontWeight: "bold", marginRight: "10px" }}> </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Customer Name:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}>
                            {/*  {trip?.customerName || ""} */}
                        </div>
                        <span style={{ fontWeight: "bold", marginRight: "10px" }}> </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>P.R. Time:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                    </div>

                    <Row>
                        <Col xs={4}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>Time In:</span>
                                <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>Time Out:</span>
                                <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Black Top K.M:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Graded Roads K.M:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Total K.M:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                        <span style={{ fontWeight: "bold", marginRight: "10px" }}> </span>
                    </div>
                </div>

                {/* Location Table */}
                <div style={{ marginBottom: "20px" }}>
                    <Table bordered style={{ border: "2px solid #000", marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        // backgroundColor: "#888888ff",
                                        color: "#000000ff",
                                        padding: "5px",
                                        fontWeight: "bold",
                                        textAlign: "left",
                                    }}
                                >
                                    From :
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: "30px", minHeight: "60px" }}>
                                    {/* {trip?.fromLocation || trip?.pickupFrom || ""} */}
                                    <div style={{ borderBottom: "1px solid #000", flex: 1, marginBottom:"23px" }}></div>
                                    <div style={{ borderBottom: "1px solid #000", flex: 1,}}></div>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table bordered style={{ border: "2px solid #000", marginTop: "10px" }}>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        // backgroundColor: "#888888ff",
                                        color: "#000000ff",
                                        padding: "5px",
                                        fontWeight: "bold",
                                        textAlign: "left",
                                    }}
                                >
                                    To :
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: "30px", minHeight: "60px" }}>
                                    <div style={{ borderBottom: "1px solid #000", flex: 1,  marginBottom:"23px"}}></div>
                                    <div style={{ borderBottom: "1px solid #000", flex: 1 }}></div>
                                    
                                  
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>

                {/* Remarks Section */}
                <div style={{ marginBottom: "20px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "5px",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}></span>
                        <span style={{ fontWeight: "bold" }}>Remarks:</span>
                    </div>
                    <div
                        style={{
                            border: "2px solid #000",
                            minHeight: "60px",
                            padding: "10px",
                        }}
                    >
                        {/* {trip?.tripDetails || trip?.details || ""} */}
                    </div>
                </div>

                {/* Total in Words */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "120px" }}>Total in Words:</span>
                        <div style={{ borderBottom: "1px solid #000", flex: 1, paddingBottom: "5px" }}></div>
                        <span style={{ fontWeight: "bold", marginRight: "10px" }}> </span>
                    </div>
                </div>

                {/* Bottom Section */}
                <Row style={{ marginTop: "30px" }}>
                    <Col xs={3}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Driver Name</div>
                            <div style={{ borderBottom: "1px solid #000", padding: "20px 0" }}></div>
                            <div style={{ fontSize: "12px", marginTop: "5px" }}> </div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Car No:</div>
                            <div style={{ borderBottom: "1px solid #000", padding: "20px 0" }}></div>
                            <div style={{ fontSize: "12px", marginTop: "5px" }}> </div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Prepared By</div>
                            <div style={{ borderBottom: "1px solid #000", padding: "20px 0" }}></div>
                            <div style={{ fontSize: "12px", marginTop: "5px" }}></div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Sign:</div>
                            <div style={{ borderBottom: "1px solid #000", padding: "20px 0" }}></div>
                            <div style={{ fontSize: "12px", marginTop: "5px" }}>  Office Sign</div>
                        </div>
                    </Col>
                </Row>

                {/* Footer */}
                <div
                    style={{
                        marginTop: "30px",
                        marginBottom:"20px",
                        paddingTop: "10px",
                        borderTop: "1px solid #ccc",
                        fontSize: "10px",
                        textAlign: "center",
                        color: "#666",
                    }}
                >
                    
                    <p style={{ margin: 0 }}>
                        Email: booking@makintl.com | makintlriyadh.com | Tel.Fax: K.S.A: (00)
                        966 11-4548, 4-K.S.A 00966512332129
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontStyle: "italic" }}>
                        Generated on {new Date().toLocaleString()}
                    </p>
                </div>
            </Container>
        </div>
    );
});

TripSheet.displayName = "TripSheet";

export default TripSheet;