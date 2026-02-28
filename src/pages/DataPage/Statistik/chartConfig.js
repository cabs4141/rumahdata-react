export const COLORS = {
    primary: "#3C50E0",
    secondary: "#80CAEE",
    success: "#10B981",
    warning: "#FFA70B",
    danger: "#E11D48",
    dark: "#1C2434",
    text: "#64748B",
    bg_card: "#FFFFFF",
};

export const getCommonOptions = () => ({
    fontFamily: "Outfit, sans-serif",
    toolbar: { show: false },
    animations: { enabled: true },
    dataLabels: { enabled: true },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3, padding: { left: 10, right: 10 } }
});

export const getBarOptions = (categories, tooltipLabel, isHorizontal = false) => {
    const commonOptions = getCommonOptions();
    return {
        ...commonOptions,
        chart: { type: "bar", toolbar: { show: false } },
        colors: isHorizontal ? [COLORS.warning] : [COLORS.primary], // default logic, overrides below if needed
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "65%",
                distributed: false,
                horizontal: isHorizontal,
                barHeight: isHorizontal ? "70%" : undefined
            }
        },
        xaxis: {
            categories: categories || [],
            labels: { style: { colors: COLORS.text, fontSize: isHorizontal ? '11px' : '12px' }, show: true },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: { labels: { style: { colors: COLORS.text } } },
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'light',
            y: {
                formatter: (val) => `${val} ${tooltipLabel}`
            }
        },
        dataLabels: isHorizontal ? { enabled: true, textAnchor: "start", style: { colors: ["#fff"], fontSize: '11px' }, offsetX: 0 } : commonOptions.dataLabels
    };
};

export const getPieOptions = (labels) => {
    const commonOptions = getCommonOptions();
    return {
        ...commonOptions,
        labels: labels || [],
        legend: { position: "bottom", fontSize: '13px', labels: { colors: COLORS.text }, itemMargin: { horizontal: 10 } },
        stroke: { show: false },
        plotOptions: {
            pie: {
                donut: { size: "70%" },
                expandOnClick: false
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '13px',
                colors: ['#FFFFFF'],
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
            },
            dropShadow: { enabled: false }
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.05,
                }
            },
            active: {
                filter: {
                    type: 'none',
                }
            }
        },
        tooltip: {
            theme: 'light',
            style: {
                fontSize: '12px',
                fontFamily: "Outfit, sans-serif",
            },
        }
    };
};
