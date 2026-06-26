# Agent Reference Guide Builder - Deployment & Usage Guide

## Overview

This guide explains how to deploy and use the ARG-Builder agent to autonomously create professional operational reference guides.

## Deployment Instructions

### Step 1: Prepare Your Business Information

Before deploying the agent, gather the following information about your business:

**Business Context**
- Official business name(s)
- Industry/vertical (e.g., Luxury Travel, Creative Services)
- Target audience for the reference guide
- Expected scale (number of personas, content volume)

**Persona Information**
For each persona (2-3 recommended):
- Official title and role
- 5 core characteristics with explanations
- 3-4 communication approaches
- 4-6 key responsibilities
- Typical workflow or process

**Process Flows**
For each persona:
- 7-stage workflow (exactly 7 stages)
- For each stage: title, description, 2-3 key activities

**Organizational Knowledge**
- 6-8 general capabilities (cross-persona competencies)
- 6-8 operational guidelines (core principles)
- Brand voice and values
- Any design preferences or constraints

### Step 2: Initialize the Agent

To deploy the ARG-Builder agent, use the following system prompt:

```
[Copy the entire content from agent-reference-guide-automation.md]
```

Provide this system prompt to Claude, Manus, or another AI agent platform.

### Step 3: Provide Business Information

Once the agent is initialized, provide your business information in the following format:

```
I need you to build an operational reference guide for my business using the ARG-Builder framework.

BUSINESS CONTEXT:
- Business Name: [Your Business Name]
- Industry: [Your Industry]
- Target Audience: [Who will use this guide]
- Scale: [Number of personas, expected content volume]

PERSONA 1: [Persona Name]
Characteristics:
- [Characteristic 1]: [Explanation]
- [Characteristic 2]: [Explanation]
- [Characteristic 3]: [Explanation]
- [Characteristic 4]: [Explanation]
- [Characteristic 5]: [Explanation]

Communication Style:
- [Approach 1]
- [Approach 2]
- [Approach 3]
- [Approach 4]

Responsibilities:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]
- [Responsibility 4]
- [Responsibility 5]
- [Responsibility 6]

Process Flow (7 stages):
1. [Stage 1 Title]: [Description]
   Key Activities: [Activity 1], [Activity 2], [Activity 3]

2. [Stage 2 Title]: [Description]
   Key Activities: [Activity 1], [Activity 2]

[Continue for all 7 stages...]

[REPEAT FOR PERSONA 2, PERSONA 3, etc.]

GENERAL CAPABILITIES:
- [Capability 1]: [Description]
- [Capability 2]: [Description]
- [Capability 3]: [Description]
- [Capability 4]: [Description]
- [Capability 5]: [Description]
- [Capability 6]: [Description]
- [Capability 7]: [Description]
- [Capability 8]: [Description]

OPERATIONAL GUIDELINES:
- [Guideline 1]: [Description]
- [Guideline 2]: [Description]
- [Guideline 3]: [Description]
- [Guideline 4]: [Description]
- [Guideline 5]: [Description]
- [Guideline 6]: [Description]
- [Guideline 7]: [Description]
- [Guideline 8]: [Description]

DESIGN PREFERENCES:
- Color Preferences: [Any specific colors you want to use]
- Typography Preferences: [Any specific fonts or styles]
- Design Philosophy: [Any specific aesthetic preferences]
- Brand Voice: [How should the guide communicate]
```

### Step 4: Monitor Agent Progress

The agent will execute the 5-phase workflow sequentially. During execution, it will:

**Phase 1 (2-4 hours):** Develop comprehensive system prompt documentation
- Refine and enhance all persona definitions
- Document complete 7-stage process flows
- Define general capabilities and operational guidelines
- Create system prompt document

**Phase 2 (1-2 hours):** Initialize web project and design system
- Select design philosophy
- Define color palette
- Select typography system
- Configure web project

**Phase 3 (4-6 hours):** Build core components
- Create Header component
- Create Persona components
- Create Search component
- Create Command Palette component
- Create Process Timeline component
- Assemble complete page

**Phase 4 (3-4 hours):** Implement advanced features
- Build search index
- Implement real-time search
- Implement Command Palette
- Implement Process Timeline
- Implement PDF export

**Phase 5 (2-3 hours):** Polish and refinement
- Visual refinement
- Interaction refinement
- Responsive design testing
- Accessibility audit
- Content review
- Comprehensive testing

**Total Time:** 12-19 hours for complete project

### Step 5: Review and Approve

As the agent completes each phase, review the output and provide feedback:

- Does the system prompt accurately reflect your business?
- Is the design philosophy appropriate for your brand?
- Are all components functioning correctly?
- Does the final application meet your expectations?

### Step 6: Deploy

Once the agent completes Phase 5 and you approve the final output:

1. The agent will create a checkpoint
2. The application will be published to a public URL
3. You'll receive a link to the live application
4. Your team can immediately start using the reference guide

## Usage Examples

### Example 1: Luxury Travel Company

```
I need you to build an operational reference guide for my luxury travel company.

BUSINESS CONTEXT:
- Business Name: Atlas Elite Travel
- Industry: Luxury Travel & Concierge Services
- Target Audience: Internal team members and select clients
- Scale: 2 personas, 50+ content items

PERSONA 1: Atlas Elite Concierge
Characteristics:
- Sophisticated & Discreet: Communicates with refined tone, understanding privacy and exclusivity needs
- Knowledgeable: Deep expertise in luxury travel, destinations, and exclusive experiences
- Proactive & Detail-Oriented: Anticipates needs, manages every detail with precision
- Resourceful: Finds solutions to complex requests, builds strong vendor relationships
- Empathetic: Understands client needs beyond stated requests, creates memorable experiences

Communication Style:
- Formal yet personable, using precise language
- Emphasizes exclusivity and bespoke experiences
- Clear & concise updates with confirmations
- Utmost confidentiality in all interactions

Responsibilities:
- Client relationship management and account ownership
- Itinerary design and customization for luxury experiences
- Vendor coordination and negotiation
- Quality assurance of all deliverables
- 24/7 concierge support during travel
- Post-trip follow-up and relationship nurturing

Process Flow (7 stages):
1. Inquiry & Qualification: Receive initial inquiry, assess client profile (net worth, travel history, preferences), determine fit for exclusive services
   Key Activities: Profile assessment, Service fit analysis, Initial consultation scheduling

2. Consultation & Proposal: Conduct in-depth consultation, present bespoke itinerary proposal with exclusive experiences
   Key Activities: Needs assessment, Itinerary design, Proposal presentation

3. Itinerary Refinement: Iterate on proposal based on feedback, secure tentative holds with vendors
   Key Activities: Feedback integration, Vendor coordination, Revised proposal

4. Booking & Confirmation: Finalize all bookings, secure confirmations, provide comprehensive itinerary
   Key Activities: Booking finalization, Payment processing, Itinerary documentation

5. Pre-Trip Preparation: Coordinate logistics, share recommendations, prepare client for experience
   Key Activities: Logistics coordination, Recommendations sharing, Final confirmations

6. In-Trip Concierge: Provide 24/7 support, manage adjustments, ensure exceptional experience
   Key Activities: Real-time support, Issue resolution, Experience optimization

7. Post-Trip Follow-up: Gather feedback, nurture relationship, plan future experiences
   Key Activities: Feedback collection, Relationship nurturing, Future planning

[Additional personas, capabilities, and guidelines...]
```

### Example 2: Creative Design Studio

```
I need you to build an operational reference guide for my creative design studio.

BUSINESS CONTEXT:
- Business Name: ArtKech Studio
- Industry: Creative Services & Independent Publishing
- Target Audience: Internal team and select clients
- Scale: 2 personas, 50+ content items

PERSONA 1: ArtKech Lead Designer
Characteristics:
- Visionary & Strategic: Sees the big picture, translates client needs into compelling visual concepts
- Meticulous & Craft-Focused: Every design element serves a purpose, built with attention to detail
- Collaborative & Communicative: Works closely with clients to understand their vision
- Innovative & Trendsetting: Stays current with design trends while maintaining timeless appeal
- Quality-Obsessed: Refuses to compromise on design standards or production quality

Communication Style:
- Professional yet creative, using visual references and examples
- Educates clients on design principles and strategic thinking
- Clear feedback and iterative refinement process
- Emphasis on craft, quality, and long-term brand value

Responsibilities:
- Brand identity development and strategic positioning
- Design concept development and creative direction
- Client collaboration and feedback integration
- Production quality assurance
- Publishing and distribution coordination
- Portfolio development and case studies

Process Flow (7 stages):
1. Discovery & Strategy: Understand client vision, market positioning, target audience
   Key Activities: Brand audit, Market research, Strategy development

2. Concept Development: Create initial design concepts, present strategic direction
   Key Activities: Mood boarding, Concept sketches, Strategic presentation

3. Design Refinement: Develop concepts based on feedback, create detailed designs
   Key Activities: Design iteration, Client feedback integration, Detailed mockups

4. Production Preparation: Prepare files for production, coordinate with vendors
   Key Activities: File preparation, Vendor coordination, Quality checks

5. Production: Oversee production process, ensure quality standards
   Key Activities: Production oversight, Quality assurance, Issue resolution

6. Delivery & Launch: Deliver final products, coordinate launch activities
   Key Activities: Final delivery, Launch coordination, Client training

7. Post-Launch Support: Gather feedback, document case study, plan future work
   Key Activities: Feedback collection, Case study development, Relationship nurturing

[Additional personas, capabilities, and guidelines...]
```

## Agent Capabilities

The ARG-Builder agent can:

**Phase 1: Content Development**
- Analyze and refine persona definitions
- Document complete 7-stage process flows
- Identify and fill content gaps
- Create comprehensive system prompt documentation

**Phase 2: Design & Setup**
- Select appropriate design philosophy
- Define cohesive color palettes
- Choose typography systems
- Configure web projects with design systems

**Phase 3: Component Building**
- Create reusable React components
- Implement responsive layouts
- Ensure accessibility compliance
- Build professional UI

**Phase 4: Feature Implementation**
- Build search indexes
- Implement real-time search
- Create command palettes
- Build interactive timelines
- Implement PDF export

**Phase 5: Quality Assurance**
- Conduct visual refinement
- Polish interactions
- Test responsiveness
- Audit accessibility
- Review content
- Comprehensive testing

## Expected Outcomes

Upon completion, you will receive:

**Live Web Application**
- Fully functional operational reference guide
- Professional design and functionality
- Production-ready quality
- Accessible at public URL

**Documentation**
- System prompt document
- Design system documentation
- Component documentation
- User guide

**Project Files**
- Complete source code
- All components and utilities
- Configuration files
- README with setup instructions

**Quality Assurance Report**
- Testing results
- Accessibility audit results
- Performance metrics
- Known issues (if any)

## Success Metrics

The project is successful if:

- All 5 phases completed with high quality
- Application is production-ready
- All quality standards met (WCAG AA, performance, etc.)
- Zero critical defects
- Team can immediately use the guide
- Application accurately reflects business operations
- Professional-grade design and functionality

## Support & Maintenance

After delivery, the agent can support:

- **Content Updates:** Update personas, processes, or guidelines
- **Feature Additions:** Add new capabilities or sections
- **Design Refinements:** Adjust colors, typography, or layout
- **Performance Optimization:** Improve load times or search speed
- **Accessibility Improvements:** Enhance accessibility compliance

## Troubleshooting

If the agent encounters issues:

1. **Incomplete Input:** Provide more detailed information about your business
2. **Design Misalignment:** Clarify design preferences or brand guidelines
3. **Feature Issues:** Describe the specific issue and expected behavior
4. **Performance Problems:** Identify which features are slow or unresponsive

## Next Steps

After your reference guide is deployed:

1. **Team Training:** Show your team how to use the guide
2. **Gather Feedback:** Collect feedback on usability and content
3. **Identify Improvements:** Plan enhancements based on feedback
4. **Iterate:** Update content and add features as needed
5. **Scale:** Expand to additional personas or content areas

## Contact & Support

For questions or issues with the ARG-Builder agent:

- Review the comprehensive system prompt documentation
- Refer to the 5-phase workflow guide
- Provide detailed information about your business and requirements
- Request specific clarifications or modifications

The agent is designed to be autonomous and comprehensive, but can adapt based on your specific needs and feedback.
