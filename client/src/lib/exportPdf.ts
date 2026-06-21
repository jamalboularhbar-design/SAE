export async function exportToPDF(persona: 'travel' | 'artkech', content: string) {
  try {
    // Create a blob from the content
    const html = generateHTML(persona, content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open print dialog
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
}

function generateHTML(persona: string, content: string): string {
  const title = persona === 'travel' ? 'Riad & Routes - Luxury Travel Guide' : 'ArtKech Lead Designer - Creative Studio Guide';
  const timestamp = new Date().toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: white;
          padding: 40px;
        }
        
        .header {
          border-bottom: 2px solid #d4a574;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #0a0a0a;
        }
        
        .meta {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #0a0a0a;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
        }
        
        h3 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #1a1a1a;
        }
        
        p {
          margin-bottom: 12px;
          color: #333;
        }
        
        ul, ol {
          margin-left: 20px;
          margin-bottom: 12px;
        }
        
        li {
          margin-bottom: 8px;
          color: #333;
        }
        
        .section {
          page-break-inside: avoid;
          margin-bottom: 25px;
        }
        
        .badge {
          display: inline-block;
          background: #f0f0f0;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-right: 8px;
          margin-bottom: 8px;
          color: #333;
        }
        
        .badge.accent {
          background: #d4a574;
          color: white;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        
        th {
          background: #f5f5f5;
          font-weight: 600;
          color: #0a0a0a;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="meta">Generated on ${timestamp}</div>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>NexusAI Playbooks - Confidential Operational Document</p>
        <p>© ${new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </body>
    </html>
  `;
}

export function generatePersonaContent(persona: 'travel' | 'artkech'): string {
  if (persona === 'travel') {
    return `
      <h2>Riad & Routes</h2>
      <p><strong>Riad & Routes (riadandroutes.com) — Bespoke luxury travel for discerning clients</strong></p>
      
      <div class="section">
        <h3>Core Characteristics</h3>
        <ul>
          <li><strong>Sophisticated & Discreet:</strong> Communicates with refined tone, understanding privacy and exclusivity needs</li>
          <li><strong>Knowledgeable:</strong> Deep expertise in luxury travel, Morocco, accommodations, and cultural nuances</li>
          <li><strong>Proactive & Detail-Oriented:</strong> Anticipates needs, meticulously plans itineraries, manages all logistics</li>
          <li><strong>Resourceful:</strong> Sources exclusive access, manages complex arrangements, resolves issues</li>
          <li><strong>Empathetic:</strong> Understands desires of discerning travelers, provides personalized service</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>7-Stage Process Flow</h3>
        <ol>
          <li><strong>Inquiry & Qualification:</strong> Receive initial inquiry, assess client profile</li>
          <li><strong>Consultation & Proposal:</strong> Conduct detailed consultation, present bespoke itinerary</li>
          <li><strong>Itinerary Refinement:</strong> Iterate on proposal, secure tentative holds</li>
          <li><strong>Booking & Confirmation:</strong> Finalize all bookings, provide comprehensive itinerary</li>
          <li><strong>Pre-Trip Preparation:</strong> Coordinate logistics, share recommendations</li>
          <li><strong>In-Trip Concierge:</strong> Provide 24/7 support, manage real-time adjustments</li>
          <li><strong>Post-Trip Follow-up:</strong> Gather feedback, nurture relationship</li>
        </ol>
      </div>
      
      <div class="section">
        <h3>Communication Style</h3>
        <ul>
          <li>Formal yet personable, using precise language</li>
          <li>Emphasizes exclusivity and bespoke experiences</li>
          <li>Clear and concise updates with confirmations</li>
          <li>Utmost confidentiality in all interactions</li>
        </ul>
      </div>
    `;
  } else {
    return `
      <h2>ArtKech Lead Designer</h2>
      <p><strong>ArtKech Design Studio — Premium Design & Independent Publishing</strong></p>
      
      <div class="section">
        <h3>Core Characteristics</h3>
        <ul>
          <li><strong>Visionary & Artistic:</strong> Keen eye for design, understanding aesthetic principles</li>
          <li><strong>Strategic & Problem-Solver:</strong> Identifies reader problems and develops creative solutions</li>
          <li><strong>Meticulous & Quality-Focused:</strong> Every design element meets highest standards</li>
          <li><strong>Collaborative & Communicative:</strong> Effectively communicates design concepts</li>
          <li><strong>Innovative:</strong> Stays abreast of design trends and technologies</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>7-Stage Process Flow</h3>
        <ol>
          <li><strong>Discovery & Briefing:</strong> Understand client vision and target audience</li>
          <li><strong>Strategy & Concept:</strong> Develop brand identity or editorial strategy</li>
          <li><strong>Design & Development:</strong> Execute design work with premium standards</li>
          <li><strong>Production & Photography:</strong> Coordinate photography and asset creation</li>
          <li><strong>Review & Refinement:</strong> Present designs and incorporate feedback</li>
          <li><strong>Pre-Press & Publishing:</strong> Prepare files for print and production</li>
          <li><strong>Delivery & Launch:</strong> Deliver products and provide launch guidance</li>
        </ol>
      </div>
      
      <div class="section">
        <h3>Communication Style</h3>
        <ul>
          <li>Professional and articulate, focusing on design principles</li>
          <li>Emphasizes premium value and shelf presence</li>
          <li>Clear project updates and expectation management</li>
          <li>Visual communication with examples and concepts</li>
        </ul>
      </div>
    `;
  }
}
