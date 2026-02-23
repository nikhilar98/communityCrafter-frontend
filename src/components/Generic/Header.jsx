import { useContext, useState } from "react"
import { userContext } from "../../App"
import { Link } from "react-router-dom"
import logo from '../../images/cmlogo6.png'
import {
    AppBar, Toolbar, IconButton, Drawer, List, ListItem,
    ListItemButton, ListItemText, Box, Typography, useMediaQuery,
    useTheme, Divider
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"

export default function Header() {

    const { userState, userDispatch } = useContext(userContext)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    function handleLogout() {
        localStorage.removeItem('token')
        userDispatch({ type: "LOGOUT_USER" })
        setDrawerOpen(false)
    }

    const isLoggedIn = Object.keys(userState.userDetails).length > 0
    const role = userState.userDetails?.role

    const getNavLinks = () => {
        if (!isLoggedIn) {
            return [
                { label: "Home", to: "/" },
                { label: "Register", to: "/register" },
                { label: "Login", to: "/login" },
            ]
        }
        const links = [{ label: "Home", to: "/" }]
        if (['communityHead', 'teacher'].includes(role)) links.push({ label: "Profile", to: "/profile" })
        if (role === 'teacher') links.push({ label: "Community Requirements", to: "/requirements" })
        if (role === 'teacher') links.push({ label: "My Commitments", to: "/classes" })
        if (role === 'communityHead') links.push({ label: "Create Requirement", to: "/create-requirement" })
        if (role === 'communityHead') links.push({ label: "My Requirements", to: "/myRequirements" })
        if (role === 'communityHead') links.push({ label: "Tutors", to: "/tutors" })
        return links
    }

    const navLinks = getNavLinks()

    const drawerContent = (
        <Box sx={{ width: 280, pt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pb: 1 }}>
                <img src={logo} alt="logo" style={{ width: "50px" }} />
                <IconButton onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.to} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={link.to}
                            onClick={() => setDrawerOpen(false)}
                            sx={{ color: "rgb(51, 102, 122)", fontWeight: 600 }}
                        >
                            <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isLoggedIn && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/"
                                onClick={handleLogout}
                                sx={{ color: "rgb(243, 73, 60)", fontWeight: 600 }}
                            >
                                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    )

    return (
        <header style={{ position: 'sticky', top: '0', zIndex: 1000 }}>
            <AppBar position="static" sx={{ backgroundColor: "rgb(226, 225, 130)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2, md: 3 } }}>
                    {/* Left: Logo + Desktop Links */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
                        <Link to="/">
                            <img src={logo} alt="cmlogo" style={{ width: "55px", display: "block" }} />
                        </Link>
                        {!isMobile && navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className="Link">{link.label}</Link>
                        ))}
                    </Box>

                    {/* Right: User info / Hamburger */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isLoggedIn && !isMobile && (
                            <>
                                <Link to='/' className='Link' onClick={handleLogout}>Logout</Link>
                                <PersonIcon sx={{ color: "rgb(51, 102, 122)", fontSize: 28 }} />
                                <Typography sx={{ color: "rgb(51, 102, 122)", fontWeight: 600, fontSize: "0.9rem" }}>
                                    {userState.userDetails.username}
                                </Typography>
                            </>
                        )}
                        {isLoggedIn && isMobile && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <PersonIcon sx={{ color: "rgb(51, 102, 122)", fontSize: 24 }} />
                                <Typography sx={{ color: "rgb(51, 102, 122)", fontWeight: 600, fontSize: "0.8rem", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {userState.userDetails.username}
                                </Typography>
                            </Box>
                        )}
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "rgb(51, 102, 122)" }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { borderRadius: "12px 0 0 12px" } }}
            >
                {drawerContent}
            </Drawer>
        </header>
    )
}