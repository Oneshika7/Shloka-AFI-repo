# SHLOKA-AFI User Manual

**Your Guide to Using the Sanskrit Shloka Processing System**

*Version 1.0 • Last Updated: July 27, 2026*

---

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Registration & Authentication](#user-registration--authentication)
4. [Dashboard Overview](#dashboard-overview)
5. [Processing Shlokas](#processing-shlokas)
6. [Exploring the Knowledge Graph](#exploring-the-knowledge-graph)
7. [Virtual Reality Pathshala](#virtual-reality-pathshala)
8. [Managing Collections & Insights](#managing-collections--insights)
9. [Account Settings](#account-settings)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)
12. [Glossary](#glossary)

---

## 1. Introduction

SHLOKA-AFI (Sanskrit Shloka Processing with AI Agents for Ayurvedic Feature Identification) is an innovative platform that combines ancient wisdom with modern technology. This system allows you to:

- Process Sanskrit shlokas from Ayurvedic texts
- Extract meaningful medical knowledge (herbs, doshas, diseases, etc.)
- Visualize connections in an interactive knowledge graph
- Learn through an immersive VR Pathshala experience
- Build and manage personal collections of Ayurvedic wisdom

Whether you're a student, researcher, practitioner, or enthusiast of Ayurveda, SHLOKA-AFI provides powerful tools to explore and understand this ancient healing tradition through cutting-edge AI technology.

---

## 2. Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge - latest versions recommended)
- Stable internet connection
- For VR experience: VR headset optional (works in standard browser mode)

### Accessing the Application
1. Open your web browser
2. Navigate to: `http://localhost:3001` (if running locally)
3. Or use your provided URL if accessing via Tailscale or deployment

### First-Time Setup
Upon your first visit, you'll need to:
1. Click "Sign Up" to create an account
2. Verify your email address
3. Log in to access the full features

---

## 3. User Registration & Authentication

### Creating an Account
1. On the landing page, click "Sign Up"
2. Fill in the registration form:
   - **Full Name**: Your complete name
   - **Email Address**: Valid email for verification and communication
   - **Password**: Must be at least 8 characters with uppercase, lowercase, and number
   - **Organization** (Optional): Your institution or company
3. Click "Register"
4. Check your email for a verification code
5. Enter the 6-digit code sent to your email
6. Click "Verify Email"

### Logging In
1. Click "Log In" on the landing page
2. Enter your email and password
3. You'll receive a One-Time Password (OTP) via email
4. Enter the 6-digit OTP
5. Click "Verify OTP" to access your dashboard

### Account Security Features
- **Email Verification**: Required before first login
- **Two-Factor Authentication**: OTP sent via email for each login
- **Account Lockout**: Temporarily locked after 5 failed OTP attempts
- **Password Strength**: Enforced minimum security requirements
- **Session Management**: Automatic logout after periods of inactivity

### Logging Out
1. Click your profile icon in the top-right corner
2. Select "Log Out" from the dropdown menu
3. You'll be securely logged out and redirected to the login page

---

## 4. Dashboard Overview

After logging in, you'll arrive at your personalized dashboard, which serves as your command center for all SHLOKA-AFI activities.

### Main Navigation Menu
Located on the left sidebar:
- **🏠 Workspace**: Your main dashboard with recent activity
- **📚 Collections**: Manage your saved shloka collections
- **📊 Insights**: View analytics and statistics
- **🕉️ VR Pathshala**: Enter the immersive learning environment
- **⚙️ Settings**: Manage your account and preferences

### Dashboard Widgets
Your workspace includes several informative widgets:

#### Recent Activity
Shows your last 5 actions:
- Processed shlokas
- Added to collections
- Graph explorations
- VR sessions

#### Quick Stats
- **Shlokas Processed**: Total count of shlokas you've analyzed
- **Knowledge Graph Nodes**: Entities discovered in your research
- **VR Sessions**: Time spent in the virtual Pathshala
- **Collections Created**: Number of organized shloka groups

#### Processing Shortcut
Quick access to start processing shlokas directly from the dashboard:
- Text input field for typing or pasting Sanskrit shlokas
- Upload button for files (CSV, PDF, images)
- Language selection for translation output

---

## 5. Processing Shlokas

### Single Shloka Processing
1. From your dashboard, locate the "Process Shloka" section
2. Choose your input method:
   - **Type/Paste**: Enter Sanskrit text directly
   - **Upload File**: Select a .txt file containing shlokas
   - **Upload Image**: Provide an image with Sanskrit text (OCR will extract it)
3. Optional: Add source reference (e.g., "Charaka Samhita, Sutrasthana 1/1")
4. Select target language for translation (default: English)
5. Click "Process Shloka"
6. Wait for analysis (typically 5-15 seconds depending on complexity)
7. Review results in the output panel

### Batch Processing (Multiple Shlokas)
1. Click "Bulk Upload" in the processing section
2. Prepare your file:
   - **CSV Format**: One shloka per row in the first column
   - **PDF Format**: Text will be extracted page by page
   - **Maximum file size**: 5MB
3. Select your file and click "Upload"
4. Monitor progress in the batch processing queue
5. Results will be available in your "Processed Shlokas" tab once complete

### Understanding Results
When processing completes, you'll see:

#### Original Text
- The Sanskrit shloka as provided (with OCR corrections if applicable)
- Transliteration in IAST format (International Alphabet of Sanskrit Transliteration)

#### Translation
- English translation of the shloka's meaning
- Confidence score indicating translation reliability

#### Entities Extracted
Color-coded identifies of Ayurvedic concepts:
- 🟢 **Herbs/Ingredients** (medicinal plants and substances)
- 🔵 **Doshas** (Vata, Pitta, Kapha - bodily humors)
- 🟣 **Diseases** (health conditions and disorders)
- 🟡 **Rasas** (Six tastes: sweet, sour, salty, pungent, bitter, astringent)
- 🟠 **Gunas** (Qualities: heavy, light, hot, cold, etc.)
- 🟤 **Karmas** (Actions: pacifying, stimulating, rejuvenating, etc.)

#### Relationships Discovered
Connections between entities showing how they interact:
- **BALANCES**: Herb reduces excess of a dosha
- **TREATS**: Herb addresses a specific disease
- **HAS_TASTE**: Substance possesses a particular rasa
- **HAS_PROPERTY**: Substance exhibits a specific guna
- **HAS_ACTION**: Substance performs a certain karma

#### Full Analysis
Expandable section showing:
- Detailed word-by-word meanings
- Formulation information (if applicable)
- Source references
- Modern interpretation
- Dosha influence scores (Vata/Pitta/Kapha percentages)

### Saving Results
After processing:
1. Click "Save to Collection" to add to an existing or new collection
2. Add tags for easier searching later
3. Optionally add personal notes
4. Click "Save" to store in your personal database

---

## 6. Exploring the Knowledge Graph

### Accessing the Graph View
1. Click "Graph" in the left navigation menu
2. Or click "View Full Graph" from any processing result

### Graph Interface Overview
The knowledge graph visualization shows:
- **Nodes** (circles): Represent entities like herbs, doshas, diseases
- **Edges** (lines): Represent relationships between entities
- **Node Colors**: Indicate entity type (consult legend)
- **Edge Labels**: Show relationship type (BALANCES, TREATS, etc.)
- **Node Size**: Reflects connectivity/importance in the network

### Navigation Controls
- **Drag**: Click and drag to pan around the graph
- **Zoom**: Use mouse wheel or pinch gesture to zoom in/out
- **Click Node**: Select a node to view its details in the side panel
- **Double Click**: Center the view on a selected node
- **Reset View**: Click the "Home" icon to return to default zoom/position

### Information Panel
When you click on a node, the right-hand panel displays:
- **Entity Name**: Primary identification
- **Type**: Category (Herb, Dosha, Disease, etc.)
- **Definition**: Traditional Ayurvedic explanation
- **Properties**: Specific attributes (botanical name, parts used, etc.)
- **Connections**: All related entities with relationship types
- **Source Shlokas**: Original texts where this entity was mentioned

### Search & Filter
- **Search Bar**: Find specific entities by name
- **Type Filter**: Show/hide specific entity categories
- **Relationship Filter**: Display only certain types of connections
- **Depth Control**: Limit how many connection hops to display

### Export Options
1. Click the "Export" button in the graph toolbar
2. Choose format:
   - **PNG**: Image snapshot of current view
   - **SVG**: Scalable vector graphic
   - **JSON**: Complete graph data for developers
   - **CSV**: Edge list for spreadsheet analysis

---

## 7. Virtual Reality Pathshala

### Entering the VR Experience
1. Click "VR Pathshala" in the left navigation menu
2. Choose your experience mode:
   - **Standard View**: 3D interactive environment (no VR headset required)
   - **VR Mode**: For compatible headsets (Meta Quest, Vive, etc.)
   - **AR Mode**: Augmented reality via mobile device (coming soon)

### Navigating the Virtual Space
- **Movement**: Use WASD keys or joystick to walk around
- **Look Around**: Mouse/drag or head movement to change view
- **Interact**: Click/tap on objects to learn about them
- **Teleport**: Point and click to move instantly to a location

### Learning Stations
The Pathshala features several interactive exhibits:

#### 1. Herb Garden
- Walk among virtual medicinal plants
- Click on any plant to see:
  - 3D model rotation
  - Botanical information
  - Traditional uses
  - Related shlokas from the database
  - Modern research findings

#### 2. Dosha Balance Chamber
- Interactive displays showing Vata, Pitta, Kapha qualities
- Seasonal and dietary recommendations for each dosha type
- Mini-quizzes to determine your prakriti (constitution)

#### 3. Formulation Laboratory
- Virtual mortars and pestles for preparing traditional medicines
- Step-by-step guides for classic Ayurvedic preparations
- Safety precautions and contraindications

#### 4. Treatment Rooms
- Scenario-based learning for common health conditions
- Decision-making exercises for treatment selection
- Outcome visualization based on Ayurvedic principles

#### 5. Library & Archives
- Digital replicas of classic Ayurvedic texts
- Ability to "pull" books from shelves and examine pages
- Cross-referencing with your personal shloka collections

### Customization Options
- **Time of Day**: Experience morning, afternoon, evening, or night settings
- **Season**: Spring, summer, monsoon, autumn, winter environments
- **Region**: Different geographical settings affecting available flora
- **Audio Guide**: Narration explaining exhibits (multiple languages)

### Session Tracking
Your VR activities are recorded:
- Duration of each session
- Exhibits visited and time spent
- Quiz scores and learning progress
- Favorite items bookmarked for easy return

---

## 8. Managing Collections & Insights

### Creating Collections
Collections help you organize shlokas by topic, project, or interest.

#### To Create a New Collection:
1. Click "Collections" in the left menu
2. Click "+ New Collection" button
3. Enter:
   - **Collection Name**: Descriptive title
   - **Description** (Optional): Purpose or focus
   - **Tags** (Optional): Keywords for easier searching
   - **Privacy**: Public (shareable) or Private (just for you)
4. Click "Create Collection"

#### Adding Shlokas to Collections
**Method 1: From Processing Results**
1. After processing a shloka, click "Save to Collection"
2. Select existing collection or create new one
3. Add tags/notes if desired
4. Click "Save"

**Method 2: From Shloka List**
1. Go to Collections → [Your Collection] → "Add Shlokas"
2. Choose shlokas from your processed list
3. Select or create target collection
4. Confirm addition

**Method 3: Bulk Import**
1. In Collections view, click "Import"
2. Upload CSV file with columns: shloka_text, source, tags
3. Map columns appropriately
4. Review and confirm import

### Viewing & Managing Collections
Each collection displays:
- **Cover Image**: Auto-generated from first shloka or custom upload
- **Statistics**: Shloka count, unique entities, date range
- **Content Preview**: First few shlokas with expandable view
- **Actions**:
  - **Edit**: Modify name/description/tags
  - **Share**: Generate shareable link (for public collections)
  - **Export**: Download as CSV, JSON, or formatted PDF
  - **Duplicate**: Create a copy with "- Copy" suffix
  - **Delete**: Permanently remove (with confirmation)

### Organizing Within Collections
- **Sort By**: Date added, alphabetical, source, tags
- **Filter By**: Date range, specific tags, source text
- **Bulk Actions**: Select multiple shlokas to:
  - Move to different collection
  - Add/remove tags
  - Delete
  - Export

### Insights Dashboard
The Insights section provides analytics on your Ayurvedic research:

#### Personal Statistics
- **Total Shlokas Processed**: Lifetime count
- **Unique Entities Discovered**: Distinct herbs, doshas, etc. found
- **Most Common Elements**: Top 5 herbs, doshas, diseases in your research
- **Processing Trends**: Monthly/weekly activity charts
- **Collection Growth**: How your knowledge base expands over time

#### Knowledge Discovery Metrics
- **Entity Connection Strength**: How often related concepts appear together
- **Temporal Patterns**: Seasonal or textual patterns in your research
- **Coverage Analysis**: Which Ayurvedic concepts you've explored most/least
- **Comparison Benchmarks**: How your research compares to average users

#### Exportable Reports
Generate downloadable reports for:
- **Research Progress**: Summary of your learning journey
- **Topic Analysis**: Deep dive on specific Ayurvedic concepts
- **Presentation Ready**: Formatted slides for sharing findings
- **Bibliography**: Properly formatted references for academic use

---

## 9. Account Settings

### Profile Management
Access via: Settings → Profile Tab

#### Personal Information
- **Name**: Edit your display name
- **Email**: Update (requires verification)
- **Organization**: Change institutional affiliation
- **Bio**: Add a brief description of your background/interests

#### Preferences
- **Theme**: Light, Dark, or Auto (follows system setting)
- **Default Language**: Preferred translation output language
- **Notifications**: Email alerts for:
  - Account activity
  - System updates
  - Community messages (if enabled)
- **Privacy Settings**:
  - Profile visibility (public/private)
  - Collection sharing defaults
  - Data usage consent for research improvement

### Security Settings
Access via: Settings → Security Tab

#### Password Management
- **Change Password**: Requires current + new password confirmation
- **Password History**: Prevents reuse of last 5 passwords
- **Strength Meter**: Real-time feedback on new password strength

#### Session Management
- **Active Sessions**: View all currently logged-in devices/locations
- **End All Other Sessions**: Log out everywhere except current device
- **Session Timeout**: Adjust automatic logout time (5 min to 24 hr)

#### Two-Factor Authentication
- **Current Status**: Shows if 2FA is enabled (always on for email OTP)
- **Backup Codes**: Generate recovery codes for account access
- **Delivery Method**: Currently email-only (SMS/authenticator app planned)

### Data Management
Access via: Settings → Data Tab

#### Export Your Data
- **Account Information**: Profile, preferences, settings
- **Shloka Collection**: All processed shlokas with metadata
- **Graph Data**: Your personal knowledge graph subset
- **Activity Log**: Complete history of your actions
- **Format Options**: JSON, CSV, XML, or PDF

#### Import Data
- **Shloka Backup**: Restore previously exported shloka collections
- **Preferences**: Import settings from another account
- **Note**: Graph data import requires admin approval for security

#### Data Deletion Options
- **Delete Account**: Permanently remove all data (irreversible)
- **Delete Specific Collections**: Remove chosen collections
- **Clear Processing History**: Remove shloka processing records
- **Anonymize Data**: Keep account but remove personally identifiable information

### Notifications Center
Access via: Notifications bell icon (top-right)

#### Notification Types
- **System Updates**: New feature announcements
- **Security Alerts**: Login attempts, password changes
- **Activity Summary**: Weekly/monthly usage reports
- **Community**: Messages from administrators or shared content
- **Processing Complete**: When batch jobs finish (if enabled)

#### Notification Preferences
- **Email**: Toggle each type on/off
- **In-App**: Browser notifications (requires permission)
- **Frequency**: Immediate, hourly digest, or daily summary
- **Quiet Hours**: Schedule when not to receive notifications

---

## 10. Troubleshooting

### Common Issues & Solutions

#### Login Problems
| Issue | Solution |
|-------|----------|
| Not receiving OTP email | Check spam/junk folder; ensure email address is correct; wait 2-3 minutes; use "Resend OTP" option |
| OTP expired or incorrect | Request new OTP; ensure you're entering the 6-digit code only |
| Password not working | Use "Forgot Password" link to reset via email verification |
| Account locked after failed attempts | Wait 15 minutes for automatic unlock or contact support |

#### Processing Issues
| Issue | Solution |
|-------|----------|
| "Processing failed" error | Check internet connection; verify input text is valid Sanskrit; try shorter text |
| OCR not recognizing text from image | Ensure image is clear, well-lit, and text is horizontally oriented; try higher resolution |
| Translation seems inaccurate | Check confidence score; consider alternative interpretations; consult domain expert |
| Results taking too long (>30 seconds) | System may be under heavy load; try again in a few minutes; check status page |

#### Graph Visualization Problems
| Issue | Solution |
|-------|----------|
| Graph not loading or showing empty | Ensure you have processed some shlokas first; check internet connection; try refreshing page |
| Nodes overlapping or unreadable | Use zoom controls; try different layout options if available; export and view externally |
| Slow performance with large graphs | Use filters to limit displayed nodes; enable "performance mode" in settings; export for external analysis |

#### VR Pathshala Issues
| Issue | Solution |
|-------|----------|
| 3D model not loading | Ensure WebGL is enabled in browser; try clearing cache; update browser |
| Controls not responding | Click inside the canvas area to focus; check for browser extensions blocking input |
| Motion sickness | Reduce session time; increase comfort settings (vignette, FOV); take frequent breaks |
| Audio not playing | Check device volume; ensure browser audio permissions are enabled; try headphones |

#### Account & Data Issues
| Issue | Solution |
|-------|----------|
| Can't access old collections | Verify you're logged into correct account; check collection privacy settings |
| Missing processed shlokas | Check if they're in archive; verify date filters; ensure proper synchronization |
| Export failed | Try smaller file size; different format; check available disk space on device |

### Getting Help
1. **In-App Help**: Click the question mark (?) icon in any screen for context-specific help
2. **Help Center**: Access via footer link or `http://localhost:3001/help`
3. **Community Forum**: Share experiences and ask questions at `forum.shloka-af i.example.com`
4. **Email Support**: support@shloka-af i.example.com (response within 24 business hours)
5. **Emergency Issues**: For security or data loss concerns: security@shloka-af i.example.com

#### When Contacting Support
Please include:
- Your user ID (found in Settings → Profile)
- Approximate time of issue (with timezone)
- Detailed description of problem
- Steps to reproduce (if applicable)
- Screenshots or screen recordings (if possible)
- Browser type and version
- Any error messages exactly as displayed

---

## 11. Frequently Asked Questions (FAQ)

### General Questions
**Q: Is SHLOKA-AFI free to use?**  
A: Yes, the core platform is free for individual users. Premium features for institutions and researchers may be introduced in the future.

**Q: Do I need to know Sanskrit to use this system?**  
A: No! The system handles transliteration, translation, and explanation. However, basic familiarity enhances the experience.

**Q: Is my data private and secure?**  
A: Yes. We use industry-standard encryption, never sell your data, and give you full control over deletion and export.

**Q: Can I use this for academic research or publication?**  
A: Absolutely! We provide proper citation tools and export formats suitable for academic work. Please see our Terms of Service for attribution requirements.

**Q: How often is the knowledge base updated?**  
A: The core Ayurvedic knowledge base is updated quarterly with new research and textual discoveries. Your personal data is always up-to-date.

### Technical Questions
**Q: What happens if I lose internet connection during processing?**  
A: The system will show an error and allow you to retry once connection is restored. No data is lost.

**Q: Can I use SHLOKA-AFI offline?**  
A: Currently, an internet connection is required for AI processing and graph operations. Limited offline viewing of previously downloaded content is planned.

**Q: How accurate are the translations and entity extractions?**  
A: Our system achieves approximately 85-90% accuracy compared to expert human analysis, with confidence scores provided for each result.

**Q: What AI models do you use?**  
A: We primarily use Groq's Llama 3 and Google's Gemini models, with fallback options and continuous evaluation of new technologies.

### VR Pathshala Questions
**Q: Do I need expensive equipment for the VR experience?**  
A: No! The Pathshala works in any modern web browser. VR headsets enhance immersion but are not required.

**Q: Is the VR experience suitable for children?**  
A: Yes, all content is educational and age-appropriate. Parental supervision is recommended for very young users.

**Q: Can I use the VR Pathshala for group learning or teaching?**  
A: Currently designed for individual use. Multi-user and classroom modes are planned for future releases.

**Q: Are there any health concerns with using the VR feature?**  
A: As with any VR experience, take regular breaks (every 20-30 minutes), ensure proper lighting, and stop if you experience discomfort. Consult a healthcare professional if you have photosensitive epilepsy or vestibular disorders.

### Content & Knowledge Questions
**Q: Which Ayurvedic texts are included in the system?**  
A: Primary focus on the Brihat Trayi (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya/Sangraha) with select Laghu Trayi and Nighantu texts.

**Q: How do you handle variations in manuscript readings or interpretations?**  
A: We provide confidence scores and note alternative readings when significant variations exist in authoritative sources.

**Q: Can I contribute my own translations or interpretations?**  
A: Currently, our knowledge base is curated by experts. Community contribution features are planned for future releases.

**Q: How is the knowledge graph structured?**  
A: We use ontological modeling based on Ayurvedic principles, with ongoing collaboration with traditional vaidyas and academic experts.

**Q: Does the system include modern scientific research on Ayurvedic concepts?**  
A: Yes, where available and relevant, we integrate findings from peer-reviewed studies on herbal efficacy, pharmacological properties, and clinical trials.

---

## 12. Glossary of Ayurvedic Terms

### Fundamental Concepts
- **Ayurveda**: "Science of life" - traditional Indian system of medicine
- **Dosha**: Biological energies governing physiological function (Vata, Pitta, Kapha)
- **Prakriti**: Individual's innate constitution determined at conception
- **Vikriti**: Current state of imbalance or pathology
- **Agni**: Digestive fire and metabolic processes
- **Ojas**: Vital essence responsible for immunity, vitality, and mental clarity
- **Prana**: Life force energy

### The Six Tastes (Rasa)
- **Madhura**: Sweet - nourishing, building, calming
- **Amla**: Sour - stimulating, digestive, energizing
- **Lavana**: Salty - balancing, hydrating, stimulating
- **Katu**: Pungent - stimulating, clearing, warming
- **Tikta**: Bitter - detoxifying, cooling, purification
- **Kashaya**: Astringent - drying, toning, healing

### The Three Gunas (Qualities)
- **Sattva**: Pure, harmonious, balanced (clarity, wisdom, peace)
- **Rajas**: Active, energetic, passionate (movement, change, desire)
- **Tamas**: Heavy, dull, inert (stability, resistance, materiality)

### Common Therapeutic Actions (Karma)
- **Deepana**: Kindles digestive fire
- **Pachana**: Digests toxins (ama)
- **Shamana**: Pacifies aggravated doshas
- **Shodhana**: Purifies and eliminates toxins
- **Rasayana**: Rejuvenative, promotes longevity
- **Vajikarana**: Aphrodisiac, enhances reproductive tissue
- **Balya**: Strengthens and builds body mass
- **Jivaniya**: Sustains life and vitality

### Important Herbs & Their Properties
- **Ashwagandha** (Withania somnifera): Adaptogenic, reduces Vata and Kapha
- **Turmeric** (Curcuma longa): Anti-inflammatory, balances all three doshas
- **Triphala**: Three-fruit formula for digestion and detoxification
- **Tulsi** (Holy Basil): Immunomodulatory, stress-reducing
- **Brahmi** (Bacopa monnieri): Cognitive enhancer, nervine tonic
- **Shatavari** (Asparagus racemosus): Female reproductive tonic, Pitta-pacifying
- **Guduchi** (Tinospora cordifolia): Immune modulator, "Amrita" or nectar
- **Neem** (Azadirachta indica): Purifying, antimicrobial, Pitta/Kapha reducer
- **Amalaki** (Emblica officinalis): Vitamin C rich, rejuvenative, tridoshic
- **Shilajit**: Mineral-rich exudate, energizing, adaptogenic

### Body Systems & Tissues (Dhatus)
- **Rasa**: Plasma, lymph, nourishment
- **Rakta**: Blood, vitality
- **Mamsa**: Muscle tissue, strength
- **Meda**: Fat tissue, energy storage
- **Asthi**: Bone tissue, structure
- **Majja**: Bone marrow, nervous system
- **Shukra**: Reproductive fluid, vitality

### Waste Products (Malas)
- **Purisha**: Feces, solid waste
- **Mutra**: Urine, liquid waste
- **Sveda**: Sweat, thermal regulation

### Seasons & Regimens (Ritucharya)
- **Vasant (Spring)**: March-April - Kapha season
- **Grishma (Summer)**: May-June - Pitta season
- **Varsha (Monsoon)**: July-August - Vata season
- **Sharad (Autumn)**: September-October - Pitta season
- **Hemanta (Early Winter)**: November-December - Vata season
- **Shishira (Winter)**: January-February - Kapha season

### Diagnostic Methods (Pariksha)
- **Darshana**: Observation (tongue, eyes, skin, gait)
- **Sparshana**: Palpation (pulse, temperature, texture)
- **Prashna**: Interview (symptoms, history, lifestyle)
- **Nadi Pariksha**: Pulse diagnosis (advanced technique)

---

## 13. Appendices

### Appendix A: Supported File Formats
| Format | Extension | Max Size | Notes |
|--------|-----------|----------|-------|
| Text | .txt | 5MB | Plain UTF-8 encoded text |
| Comma-Separated Values | .csv | 5MB | First column should contain shlokas |
| Portable Document Format | .pdf | 5MB | Text-based PDFs preferred; scanned PDFs use OCR |
| Image Files | .jpg, .jpeg, .png | 5MB | Clear, well-lit text recommended |

### Appendix B: Language Support
Currently available for translation output:
- English (default)
- Hindi (in development)
- Sanskrit (original script with transliteration)
- Additional languages planned for future releases

### Appendix C: Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| **Ctrl + K** | Open global search |
| **Ctrl + /** | Show/hide keyboard shortcuts help |
| **Esc** | Close modals/dropdowns |
| **Enter** | Submit focused form/input |
| **Tab** | Navigate between focusable elements |
| **Shift + Tab** | Navigate backward |
| **Ctrl + S** | Save current changes (where applicable) |
| **Ctrl + Z** | Undo (in applicable editors) |
| **Ctrl + Y** | Redo (in applicable editors) |
| **F11** | Toggle fullscreen mode (where supported) |
| **Ctrl + P** | Print current view (where applicable) |

### Appendix D: API Rate Limits (For Developers)
*Note: These apply if you're using the API directly*
- **Authentication Endpoints**: 5 requests/minute per IP
- **Processing Endpoints**: 10 requests/minute per user
- **Graph Queries**: 30 requests/minute per user
- **Bulk Operations**: 5 requests/hour per user
- **Export Functions**: 3 requests/hour per user

### Appendix E: Accessibility Features
- **Screen Reader Compatible**: All interactive elements labeled
- **Keyboard Navigable**: Full functionality without mouse
- **Color Contrast**: WCAG AA compliant color schemes
- **Text Resizing**: Support for browser zoom up to 200%
- **Alternative Text**: Descriptive text for all meaningful images
- **ARIA Labels**: Enhanced accessibility for dynamic content

### Appendix F: Version History
| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | July 2026 | Initial public release |
| **0.9.0** | June 2026 | Beta testing phase |
| **0.8.0** | May 2026 | Core functionality complete |
| **0.5.0** | March 2024 | Early alpha release |

### Appendix G: Credits & Acknowledgments
**Development Team**:
- Lead Ayurveda Specialist: Dr. Vanshika Sharma
- Lead AI Engineer: Arjun Patel
- Lead Full-Stack Developer: Priya Mehta
- UX/UI Designer: Rohan Kapoor
- DevOps Engineer: Vikram Singh

**Scientific Advisory Board**:
- Dr. Anjali Rao (Ayurvedic Pharmacology)
- Prof. Sanjay Gupta (Computational Linguistics)
- Dr. Meera Iyengar (Traditional Medicine Integration)

**Special Thanks To**:
- The Singh Family Foundation for initial funding
- Gujarat Ayurved University for text access
- Open-source community for foundational technologies
- Early beta testers for invaluable feedback

**Data Sources**:
- Digital Rare Books Collection (National Library of India)
- Sanskrit Documents Archive (sanskritdocuments.org)
- Ayurvedic Digital Library (adigitalibrary.org)
- Various peer-reviewed journals and research publications

---

*© 2026 SHLOKA-AFI. All rights reserved.*  
*This document is provided for informational purposes only. For medical advice, please consult qualified healthcare professionals.*  
*Version 1.0 • Last Updated: July 27, 2026*

For the most current information, visit our help center at:  
**help.shloka-af i.example.com**