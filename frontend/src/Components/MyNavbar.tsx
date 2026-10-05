import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function MyNavbar() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    TriviaHub
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>

                        <Nav.Link as={Link} to="/quizzes">
                            Quizzes
                        </Nav.Link>

                        <Nav.Link as={Link} to="/leaderboard">
                            Leaderboard
                        </Nav.Link>

                        <Nav.Link as={Link} to="/admin">
                            Admin
                        </Nav.Link>

                        <NavDropdown title="More" id="collapsible-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/about">
                                About
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;