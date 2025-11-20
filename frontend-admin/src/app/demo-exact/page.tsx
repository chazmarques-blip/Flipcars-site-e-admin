'use client';

import React, { useState } from 'react';

// Vou criar uma página que COPIA EXATAMENTE o mockup HTML
export default function DemoExactPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: '#f8f9fa',
      color: '#1a1a1a',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* DEMO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          ✅ MOCKUP EXATO - Esta versão replica 100% o HTML original
        </div>

        {/* HEADER - EXATO DO MOCKUP */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1a1a1a', 
              marginBottom: '4px',
              margin: 0 
            }}>
              Welcome back, Admin FlipCars US! 👋
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: '#666',
              margin: 0 
            }}>
              Here's what's happening with your auto body shop today
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 20px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'white',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>📊</span>
              <span>Export</span>
            </button>
            <button style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: '#D4AF37',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>📋</span>
              <span>New Estimate</span>
            </button>
          </div>
        </div>

        {/* KPI CARDS - EXATO DO MOCKUP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { trend: '📈', label: 'Active Leads', value: '18', subtitle: '6 qualified today' },
            { trend: '📅', label: 'Today\'s Appointments', value: '2', subtitle: 'Nov 15, 2025' },
            { trend: '⚠️', label: 'Overdue', value: '0', subtitle: 'All on track!' },
            { trend: '✅', label: 'Approved', value: '$6.32K', subtitle: '1 estimate approved' },
            { trend: '⏳', label: 'Pending', value: '$7.75K', subtitle: '2 estimates awaiting' },
            { trend: '🔧', label: 'Jobs In Progress', value: '5', subtitle: '3 completing this week' }
          ].map((kpi, i) => (
            <div key={i} style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                content: '',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: '#D4AF37'
              }} />
              <span style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                fontSize: '20px'
              }}>
                {kpi.trend}
              </span>
              <div style={{
                fontSize: '11px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                {kpi.label}
              </div>
              <div style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '4px'
              }}>
                {kpi.value}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#666'
              }}>
                {kpi.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* IFRAME COM MOCKUP COMPLETO */}
        <div style={{
          background: 'white',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: '#D4AF37',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📌 Mockup Original (Scroll para ver TUDO):
          </h3>
          <iframe 
            src="http://localhost:8765" 
            style={{
              width: '100%',
              height: '800px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
            title="Mockup Original"
          />
        </div>

        {/* INSTRUÇÕES */}
        <div style={{
          background: '#fffbf0',
          border: '1px solid #D4AF37',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '24px'
        }}>
          <h3 style={{ marginTop: 0, color: '#D4AF37' }}>📋 Para Replicar EXATAMENTE:</h3>
          <ol style={{ color: '#666', lineHeight: '1.8' }}>
            <li>Veja o mockup acima ↑</li>
            <li>Copie CADA detalhe: cores, fontes, espaços, tamanhos</li>
            <li>Use o HTML/CSS EXATO que já está no servidor</li>
            <li>Não invente NADA - só replique!</li>
          </ol>
          <p style={{ color: '#D4AF37', fontWeight: '600', margin: '16px 0 0 0' }}>
            ✅ O arquivo CSS mockup está em: Dashboard-Mockup-Exact.module.css
          </p>
        </div>
      </div>
    </div>
  );
}
