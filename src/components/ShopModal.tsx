import React, { useState } from 'react';
import { SHOP_PRICES } from '@/config/shop';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGold: number;
  currentKeys: number;
  onPurchase: (itemType: 'key', amount: number, cost: number) => void;
}

export function ShopModal({ isOpen, onClose, currentGold, currentKeys, onPurchase }: ShopModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const keyPrice = SHOP_PRICES.key;
  const totalCost = keyPrice * quantity;
  const canAfford = currentGold >= totalCost;
  const maxAffordable = Math.floor(currentGold / keyPrice);

  const handlePurchase = () => {
    if (canAfford && quantity > 0) {
      onPurchase('key', quantity, totalCost);
      setQuantity(1); // Reset quantity after purchase
    }
  };

  const handleBuyMax = () => {
    if (maxAffordable > 0) {
      setQuantity(maxAffordable);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{
          backgroundColor: '#2d2925',
          borderColor: '#4a443f',
          border: '2px solid'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <img 
              src="/src/assets/menu/GrandExchange_icon.png" 
              alt="Shop" 
              className="w-8 h-8"
            />
            Shop
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Current Resources */}
        <div className="mb-6 p-3 rounded" style={{ backgroundColor: '#1a1714' }}>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Your Gold</div>
              <div className="text-yellow-500 text-lg font-bold">💰 {currentGold}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Your Keys</div>
              <div className="text-blue-400 text-lg font-bold">🔑 {currentKeys}</div>
            </div>
          </div>
        </div>

        {/* Shop Item - Keys */}
        <div className="space-y-4">
          <div className="p-4 rounded border" style={{ borderColor: '#4a443f', backgroundColor: '#1a1714' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔑</span>
                <div>
                  <div className="text-white font-semibold">Key</div>
                  <div className="text-yellow-500 text-sm">💰 {keyPrice} Gold each</div>
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 text-white border rounded"
                  style={{
                    backgroundColor: '#3a3530',
                    borderColor: '#574f47',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  -
                </button>
                
                <input
                  type="number"
                  min="1"
                  max={maxAffordable}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 text-white text-center rounded border"
                  style={{
                    backgroundColor: '#1a1714',
                    borderColor: '#4a443f'
                  }}
                />
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 text-white border rounded"
                  style={{
                    backgroundColor: '#3a3530',
                    borderColor: '#574f47',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  +
                </button>

                <button
                  onClick={handleBuyMax}
                  className="px-3 py-2 text-white text-sm rounded border"
                  style={{
                    backgroundColor: '#3a3530',
                    borderColor: '#574f47',
                    transition: 'transform 0.2s, background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = '#4a443f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#3a3530';
                  }}
                >
                  Max
                </button>
              </div>

              {/* Total Cost */}
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#2d2925' }}>
                <span className="text-gray-400 text-sm">Total: </span>
                <span className={`font-bold ${canAfford ? 'text-yellow-500' : 'text-red-500'}`}>
                  💰 {totalCost} Gold
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="mt-6">
          <button
            onClick={handlePurchase}
            disabled={!canAfford || quantity < 1}
            className="w-full px-4 py-3 text-white rounded font-semibold border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canAfford 
                ? 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)'
                : 'linear-gradient(180deg, #4a4440 0%, #3a3530 50%, #2a2520 100%)',
              borderColor: canAfford ? '#3D2F24' : '#4a443f',
              transition: 'transform 0.2s, background 0.2s'
            }}
            onMouseEnter={(e) => {
              if (canAfford) {
                e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (canAfford) {
                e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {canAfford 
              ? `Purchase ${quantity} Key${quantity > 1 ? 's' : ''} for ${totalCost} Gold`
              : 'Not Enough Gold'
            }
          </button>
          
          {!canAfford && maxAffordable > 0 && (
            <p className="text-center text-yellow-600 text-xs mt-2">
              You can afford {maxAffordable} key{maxAffordable > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

