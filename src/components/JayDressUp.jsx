import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Copy } from 'lucide-react';
import { toast } from "sonner";

const clothingOptions = {
  tops: ['Coat', 'Hoodie', 'Sprayjacket', 'Tee', 'Buttonup', 'Blazer'],
  bottoms: ['Jeans', 'Stubbies', 'Pants', 'Trousers'],
  shoes: ['Sneakers', 'Salomons', 'Birks', 'Chucks', 'Crocs', 'Docs'],
  accessories: ['Rings', 'Cap', 'Beard', 'Flowers', 'Glasses Square', 'Glasses Round', 'Glasses Reading', 'Watch Classy', 'Watch Nerd', 'Watch Nerd+', 'Watch Shiny'],
  perfume: ['Figgy', 'Smoky', 'Fresh']
};

const exclusiveGroups = {
  glasses: ['Glasses Square', 'Glasses Round', 'Glasses Reading'],
  watches: ['Watch Classy', 'Watch Nerd', 'Watch Nerd+', 'Watch Shiny']
};

export default function JayDressUp() {
  const [category, setCategory] = useState('tops');
  const [selectedOptions, setSelectedOptions] = useState({ accessories: [] });

  const toggleOption = (option) => {
    if (category === 'accessories') {
      setSelectedOptions((prev) => {
        const isSelected = prev.accessories.includes(option);
        let updated = [...prev.accessories];

        const group = Object.values(exclusiveGroups).find(g => g.includes(option));
        if (group) {
          updated = updated.filter(item => !group.includes(item));
          if (!isSelected) updated.push(option);
        } else {
          updated = isSelected
            ? updated.filter(item => item !== option)
            : [...updated, option];
        }

        return { ...prev, accessories: updated };
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [category]: prev[category] === option ? null : option
      }));
    }
  };

  const generateCode = () => {
    const getExclusiveIndex = (group) => {
      const selected = exclusiveGroups[group].find(opt => selectedOptions.accessories?.includes(opt));
      return selected ? exclusiveGroups[group].indexOf(selected) + 1 : 0;
    };

    const tops = clothingOptions.tops.indexOf(selectedOptions.tops) + 1 || 0;
    const bottoms = clothingOptions.bottoms.indexOf(selectedOptions.bottoms) + 1 || 0;
    const shoes = clothingOptions.shoes.indexOf(selectedOptions.shoes) + 1 || 0;

    const miscAccessories = ['Rings', 'Cap', 'Beard', 'Flowers'].map(
      item => selectedOptions.accessories?.includes(item) ? '1' : '0'
    ).join('');

    const glasses = getExclusiveIndex('glasses');
    const watches = getExclusiveIndex('watches');
    const perfume = clothingOptions.perfume.indexOf(selectedOptions.perfume) + 1 || 0;

    return `${tops}${bottoms}${shoes}${miscAccessories}${glasses}${watches}${perfume}`;
  };

  const copyToClipboard = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    toast.success("Style code copied to clipboard!");
  };

  const groupedAccessories = [
    ['Rings', 'Cap', 'Beard', 'Flowers'],
    ['Glasses Square', 'Glasses Round', 'Glasses Reading'],
    ['Watch Classy', 'Watch Nerd', 'Watch Nerd+', 'Watch Shiny']
  ];

  const imageLayers = ['bottoms', 'shoes', 'tops'];

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-[url('/backgrounds/room.png')] bg-cover overflow-hidden">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-green-100 overflow-hidden">
        <div className="sticky top-0 z-30 flex justify-between items-center px-4 py-2 bg-white/80 backdrop-blur-sm bg-red-100">
          <img src="/logo.png" alt="Logo" className="w-24 bg-yellow-200" />
          <a href="https://your-link.com" target="_blank" rel="noopener noreferrer">
            <img src="/message.png" alt="Message" className="w-10 bg-yellow-200" />
          </a>
        </div>

        <div className="relative flex-1 bg-purple-100 overflow-hidden">
          <img src="/jay_model.png" alt="Jay Model" className="absolute top-0 left-0 w-full h-full object-contain z-0 bg-purple-200" />
          {imageLayers.map(cat => (
            selectedOptions[cat] && (
              <img
                key={cat}
                src={`/clothes/${cat}/${selectedOptions[cat]}.png`}
                alt={`${cat} overlay`}
                className="absolute top-0 left-0 w-full h-full object-contain z-10"
              />
            )
          ))}
          {selectedOptions.accessories?.map(item => (
            <img
              key={item}
              src={`/clothes/accessories/${item.replace(/ /g, '_')}.png`}
              alt={`${item} overlay`}
              className="absolute top-0 left-0 w-full h-full object-contain z-20"
            />
          ))}
          {selectedOptions.perfume && (
            <img
              src={`/clothes/perfume/${selectedOptions.perfume}.png`}
              alt="perfume overlay"
              className="absolute top-0 left-0 w-full h-full object-contain z-30"
            />
          )}
        </div>
      </div>

      <div className="sticky bottom-0 w-full max-w-md mx-auto bg-orange-100">
        <div className="flex gap-2 p-4 justify-center bg-[url('/ui/tab-bg.png')] bg-contain bg-no-repeat">
          {['tops', 'bottoms', 'shoes', 'accessories', 'save'].map((tab) => (
            <img
              key={tab}
              src={`/ui/icon-${tab}${category === tab ? '-active' : ''}.png`}
              alt={tab}
              onClick={() => setCategory(tab)}
              className="w-12 h-12 cursor-pointer bg-orange-200"
            />
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto p-4 bg-[url('/ui/options-bg.png')] bg-contain bg-no-repeat bg-pink-100">
          {category === 'accessories' ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                {groupedAccessories[0].map((option, idx) => {
                  const selected = selectedOptions.accessories?.includes(option);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center cursor-pointer bg-yellow-100 p-2 rounded-lg"
                      onClick={() => toggleOption(option)}
                    >
                      <img
                        src={`/ui/option-accessories/${option.replace(/ /g, '_')}${selected ? '-on' : '-off'}.png`}
                        alt={option}
                        className="w-16 h-16 bg-blue-100"
                      />
                      <span className={`mt-1 text-xs ${selected ? 'text-green-600 font-bold' : 'text-gray-700'}`}>{option}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Glasses</p>
                <div className="grid grid-cols-3 gap-2">
                  {groupedAccessories[1].map((option, idx) => {
                    const selected = selectedOptions.accessories?.includes(option);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center cursor-pointer bg-yellow-100 p-2 rounded-lg"
                        onClick={() => toggleOption(option)}
                      >
                        <img
                          src={`/ui/option-accessories/${option.replace(/ /g, '_')}${selected ? '-on' : '-off'}.png`}
                          alt={option}
                          className="w-16 h-16 bg-blue-100"
                        />
                        <span className={`mt-1 text-xs ${selected ? 'text-green-600 font-bold' : 'text-gray-700'}`}>{option}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Watches</p>
                <div className="grid grid-cols-4 gap-2">
                  {groupedAccessories[2].map((option, idx) => {
                    const selected = selectedOptions.accessories?.includes(option);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center cursor-pointer bg-yellow-100 p-2 rounded-lg"
                        onClick={() => toggleOption(option)}
                      >
                        <img
                          src={`/ui/option-accessories/${option.replace(/ /g, '_')}${selected ? '-on' : '-off'}.png`}
                          alt={option}
                          className="w-16 h-16 bg-blue-100"
                        />
                        <span className={`mt-1 text-xs ${selected ? 'text-green-600 font-bold' : 'text-gray-700'}`}>{option}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : category === 'save' ? (
            <div className="text-center">
              <p className="mt-2 font-semibold text-white">Spray me!</p>
              <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
                {clothingOptions.perfume.map((option, idx) => {
                  const selected = selectedOptions.perfume === option;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center cursor-pointer bg-yellow-100 p-2 rounded-lg"
                      onClick={() => setSelectedOptions(prev => ({ ...prev, perfume: prev.perfume === option ? null : option }))}
                    >
                      <img
                        src={`/ui/option-perfume/${option.replace(/ /g, '_')}${selected ? '-on' : '-off'}.png`}
                        alt={option}
                        className="w-16 h-16 bg-blue-100"
                      />
                      <span className={`mt-1 text-xs ${selected ? 'text-green-600 font-bold' : 'text-gray-700'}`}>{option}</span>
                    </div>
                  );
                })}
              </div>
              <p className="font-bold text-white drop-shadow mb-2">Share this code on Hinge to redeem:</p>
              <div className="flex justify-center items-center gap-2">
                <p
                  className="text-xl bg-white text-black px-4 py-2 rounded font-mono cursor-pointer"
                  onClick={copyToClipboard}
                >
                  {generateCode()}
                </p>
                <Copy className="text-white cursor-pointer" onClick={copyToClipboard} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {clothingOptions[category]?.map((option, idx) => {
                const selected = selectedOptions[category] === option;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center cursor-pointer bg-yellow-100 p-2 rounded-lg"
                    onClick={() => toggleOption(option)}
                  >
                    <img
                      src={`/ui/option-${category}/${option.replace(/ /g, '_')}${selected ? '-on' : '-off'}.png`}
                      alt={option}
                      className="w-16 h-16 bg-blue-100"
                    />
                    <span className={`mt-1 text-xs ${selected ? 'text-green-600 font-bold' : 'text-gray-700'}`}>{option}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
