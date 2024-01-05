import { DonutChart,Card,Title } from "@tremor/react";
import React from "@tremor/react";





  const generateDonut = ({ data, text }) => {

  
    const transformedData = data.map(([label, value]) => ({
      first: label,
      second:  value,
    }));
  
    return (
      <Card className="donutChart">
        <Title>{text}</Title>
        <DonutChart
          className="mt-6"
          data={transformedData}
          category="second"
          index="first"
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          variant="pie"

        />
      </Card>
    );
  };
  
  export default generateDonut;