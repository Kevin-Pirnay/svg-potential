
class Element
{
    id = 0;
}

class Html_element extends Element
{
    get_html_element = () =>
    {
        return document.getElementById(`${this.id}`);
    }
}

class SVG extends Html_element
{
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    elements = [];
}

class SVG_element extends SVG
{
    toString = () =>
    {
        return `<svg id=${this.id} viewBox="${this.x} ${this.y} ${this.width} ${this.height}">

        <defs>
            <pattern id="img1" patternUnits="userSpaceOnUse" width="800" height="800">
            <image href="img.jpeg" x="-100" y="-100" width="800" height="800" />
            </pattern>
        </defs>

        ${this.elements.map(element => element.toString())}
        </svg>`
    }
}

class Adder
{
    svg = {};

    init = (svg) =>
    {
        this.svg = svg;
        return this;
    }

    add_to_svg = (element) =>
    {
        this.svg.elements.push(element);
        return this;
    }
}

class Paint extends Html_element
{
    pathLength = 100;
    stroke_dasharray = 100;
    stroke_dashoffset = 100;
    stroke = "black";
    fill = "url(#img1)";
}

class Circle extends Paint
{
    cx = 0;
    cy = 0;
    radius = 0;
}

class Circle_element extends Circle
{
    toString = () =>
    {
        return `<circle id=${this.id} cx=${this.cx} cy=${this.cy} r=${this.radius} stroke=${this.stroke} fill=${this.fill} pathLength="${this.pathLength}" stroke-dasharray="${this.stroke_dasharray}" stroke-dashoffset="${this.stroke_dashoffset}" />`
    }

    setOrigin = () =>
    {
        this.get_html_element().setAttribute("cx", this.cx);
        this.get_html_element().setAttribute("cy", this.cy);
    }

    setDashOffset = () =>
    {
        this.get_html_element().setAttribute("stroke-dashoffset", this.stroke_dashoffset);
    }
}

class Rect extends Paint
{
    x = 0;
    y = 0;
    width = 0;
    height = 0;
}

class Rect_element extends Rect
{
    toString = () =>
    {
        return `<rect id=${this.id} x=${this.x} y=${this.y} width=${this.width} height=${this.height} stroke=${this.stroke} fill=${this.fill} />`
    }
}

class QLine extends Paint
{
    origin = { x:0, y:0 };
    middle = { x:0, y:0 };
    end = { x:0, y:0 };
}

class QLine_element extends QLine
{
    toString = () =>
    {
        return `<path id=${this.id} d="M${this.origin.x},${this.origin.y} Q${this.middle.x},${this.middle.y} ${this.end.x},${this.end.y}" stroke=${this.stroke} fill=${this.fill} />`;
    }

    setQuadratic = () =>
    {
        const d = `M${this.origin.x},${this.origin.y} Q${this.middle.x},${this.middle.y} ${this.end.x},${this.end.y}`;
        this.get_html_element().setAttribute("d", d);
    }
}

class Shape extends Paint
{
    points = [];
}

class Shape_element extends Shape
{

    toString = () =>
    {
        let str = "";
        str += `<path id=${this.id} d="M${this.points[0].x} ${this.points[0].y}`;

        for(let i = 0; i < this.points.length; i++)
        {
            str += ` L${this.points[i].x} ${this.points[i].y}`;
        }

        str += `" stroke=${this.stroke} fill=${this.fill} />`;

        //str += `" />`

        //return `<path id=${this.id} d="M${this.points[0].x} ${this.points[0].y} ${this.points.map(point => `L${point.x} ${point.y}`)}" stroke=${this.stroke} fill=${this.fill} />`;

        return str;
    }

    setPoints = () =>
    {
        let d = "";

        d=`M${this.points[0].x} ${this.points[0].y}`;

        for(let i = 0; i < this.points.length; i++)
        {
            d += ` L${this.points[i].x} ${this.points[i].y}`;
        }

        this.get_html_element().setAttribute("d", d);
    }
}

class ElementBuilder
{
    current_id = 0;

    build_svg_element = (x, y, width, height) =>
    {
        const svg = new SVG_element();
        svg.x = x;
        svg.y = y;
        svg.width = width;
        svg.height = height;
        svg.id = this.current_id++;

        return svg;
    }

    build_circle_element = (x, y, r) =>
    {
        const circle = new Circle_element();
        circle.cx = x;
        circle.cy = y;
        circle.radius = r;
        circle.fill = "none";
        circle.id = this.current_id++;

        return circle;
    }

    build_rect_element = (x, y, width, height) =>
    {
        const rect = new Rect_element();
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        rect.id = this.current_id++;

        return rect;
    }

    build_qline_element = (origin, middle, end) =>
    {
        const qline = new QLine_element();
        qline.origin.x = origin.x;
        qline.origin.y = origin.y;
        qline.middle.x = middle.x;
        qline.middle.y = middle.y;
        qline.end.x = end.x;
        qline.end.y = end.y;
        qline.id = this.current_id++;
        qline.fill = "none";

        return qline;
    }

    build_shape_element = () =>
    {
        const shape = new Shape_element();
        shape.id = this.current_id++;

        return shape;
    }
}

const transform_into_svg_point = (x, y, svg_html) =>
{
    const pt = svg_html.createSVGPoint();

    pt.x = x; 
    pt.y = y;

    return pt.matrixTransform(svg_html.getScreenCTM().inverse());
}

class Matrix_manipulator
{
    scale_matrix = [
        {x:1, y:0, z:0},
        {x:0, y:1, z:0},
        {x:0, y:0, z:1}
    ]

    multiply_matrix_by_number = (number, matrix) =>
    {
        const result_matrix = [];
    
        for(let i = 0; i < matrix.length; i++)
        {
            const new_point = {x:0, y:0, z:0};
    
            new_point.x = matrix[i].x * number;
            new_point.y = matrix[i].y * number;
            new_point.z = matrix[i].z * number;
    
            result_matrix.push(new_point);
        }
    
        return result_matrix;
    }

    multiply_matrix_by_matrix = (matrix1, matrix2) =>
    {
        const result_matrix = [];
    
        for(let i = 0; i < matrix1.length; i++)
        {
            const new_point = {x:0, y:0, z:0}; //each point got the transformation on the right dimension from each axes sinse those axes are not anymore align with the 0
    
            new_point.x = matrix1[i].x * matrix2[0].x + matrix1[i].y * matrix2[0].y + matrix1[i].z * matrix2[0].z;
            new_point.y = matrix1[i].x * matrix2[1].x + matrix1[i].y * matrix2[1].y + matrix1[i].z * matrix2[1].z;
            new_point.z = matrix1[i].x * matrix2[2].x + matrix1[i].y * matrix2[2].y + matrix1[i].z * matrix2[2].z;

            result_matrix.push(new_point);
        }
    
        return result_matrix;
    }

    scale_a_matrix(number, matrix)
    {
        const scaler = this.multiply_matrix_by_number(number, this.scale_matrix);

        const result = this.multiply_matrix_by_matrix(matrix, scaler);

        return result;
    }

    translate_a_matrix = (x, y, z, matrix) =>
    {
        const result_matrix = [];
    
        for(let i = 0; i < matrix.length; i++)
        {
            const new_point = {x:0, y:0, z:0}; // each points got the exact same transformation on their components
    
            new_point.x = matrix[i].x + x;
            new_point.y = matrix[i].y + y;
            new_point.z = matrix[i].z + z;
    
            result_matrix.push(new_point);
        }
    
        return result_matrix;
    }

    rotate_z = (angle, matrix) =>
    {
        const rotation_z_matrix = [
            { x:Math.cos(angle), y:Math.sin(angle), z:0 },
            { x:-Math.sin(angle), y:Math.cos(angle), z:0 },
            { x:0, y:0, z:1 }
        ]

        const result_matrix = this.multiply_matrix_by_matrix(matrix, rotation_z_matrix);

        return result_matrix;
    }

    rotate_y = (angle, matrix) =>
    {
        const rotation_y_matrix = [
            { x:Math.cos(angle), y:0, z:Math.sin(angle) },
            { x:0, y:1, z:0 },
            { x:-Math.sin(angle), y:0, z:Math.cos(angle) }
        ]

        const result_matrix = this.multiply_matrix_by_matrix(matrix, rotation_y_matrix);

        return result_matrix;
    }

    rotate_x = (angle, matrix) =>
    {
        const rotation_x_matrix = [
            { x:1, y:0, z:0 },
            { x:0, y:Math.cos(angle), z:-Math.sin(angle) },
            { x:0, y:Math.sin(angle), z:Math.cos(angle) },
        ]

        const result_matrix = this.multiply_matrix_by_matrix(matrix, rotation_x_matrix);

        return result_matrix;
    }

    get_center_point = (matrix) =>
    {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < matrix.length; i++)
        {
            x += matrix[i].x;
            y += matrix[i].y;
            z += matrix[i].z;
        }

        x = x / matrix.length;
        y = y / matrix.length;
        z = z / matrix.length;

        const center_point = {x:x, y:y, z:z};


        return center_point;
    }
}

class Timer
{
    begin_time = 0;
    duration = 0;

    init = (duration) =>
    {
        const d = new Date();
        const current_time = d.getTime();

        this.begin_time = current_time;
        this.duration = duration;

        return this;
    }

    get_percent_time = () =>
    {
        const d = new Date();
        const current_time = d.getTime();

        const spent_time = current_time - this.begin_time;

        const percent = ( spent_time / this.duration ) * 100;

        return percent/100;
    }
}

class Percent_converter
{
    max_value = 0;
    a = 0;
    b = 0;

    init = (max_value) =>
    {
        this.max_value = max_value;
        return this;
    }

    convert_time_into_value = (percent_time, coefficient) =>
    {
        return this.max_value * percent_time * coefficient;
    }
}

main = async () =>
{
    const builder = new ElementBuilder();

    const svg = builder.build_svg_element(0,0,1000,1000);

    const shape = builder.build_shape_element();
    
    let points = [
        {x:400, y:400, z:0},
        {x:500, y:400, z:0},
        {x:500, y:500, z:0},
        {x:400, y:500, z:0},

        {x:400, y:400, z:100},
        {x:500, y:400, z:100},
        {x:500, y:500, z:100},
        {x:400, y:500, z:100},
    ];
    
    shape.points = points;

    const adder = new Adder()
        .init(svg)
        .add_to_svg(shape);

        document.querySelector("#container").innerHTML = svg.toString();
        
        const sh = shape.get_html_element();
        sh.backgroundColor = "red";

    const matrix_manip = new Matrix_manipulator();

      
    const timer = new Timer().init(1000);
    const converter = new Percent_converter().init(Math.PI/8);
    let percent_time = 0;
    let converted_value = 0;
    while(1)
    {
        if ( percent_time >= 1 ) break;

        percent_time = timer.get_percent_time();
        converted_value = converter.convert_time_into_value(percent_time,1);

        const rotate_z_points = matrix_manip.rotate_z(converted_value, points);
        shape.points = rotate_z_points;
        shape.setPoints();

        await new Promise(r => setTimeout(r, 1));
    }

    timer.init(1000);
    converter.init(Math.PI/4);
    percent_time = 0;
    converted_value = 0;
    points = shape.points;
    while(1)
    {
        if ( percent_time >= 1 ) break;

        percent_time = timer.get_percent_time();
        converted_value = converter.convert_time_into_value(percent_time,1);

        const rotate_y_points = matrix_manip.rotate_y(converted_value, points);
        shape.points = rotate_y_points;
        shape.setPoints();

        await new Promise(r => setTimeout(r, 1));
    }

    timer.init(1000);
    converter.init(-Math.PI/4);
    percent_time = 0;
    converted_value = 0;
    points = shape.points;
    let center_point = matrix_manip.get_center_point(points);
    let origin = matrix_manip.translate_a_matrix(-center_point.x, -center_point.y, -center_point.z, points);
    while(1)
    {
        if ( percent_time >= 1 ) break;

        percent_time = timer.get_percent_time();
        converted_value = converter.convert_time_into_value(percent_time,1);

        const rotate_x_points = matrix_manip.rotate_x(converted_value, origin);

        const x = center_point.x;
        const y = center_point.y;
        const z = center_point.z; 

        const final = matrix_manip.translate_a_matrix(x,y,z,rotate_x_points);

        shape.points = final;
        shape.setPoints();

        await new Promise(r => setTimeout(r, 1));
    }

    timer.init(1000);
    converter.init(3.5);
    percent_time = 0;
    converted_value = 0;
    points = shape.points;
    center_point = matrix_manip.get_center_point(points);
    origin = matrix_manip.translate_a_matrix(-center_point.x, -center_point.y, -center_point.z, points);

    while(1)
    {
        if ( percent_time >= 1 ) break;

        percent_time = timer.get_percent_time();
        converted_value = converter.convert_time_into_value(percent_time,1);

        if ( converted_value <=1 ) continue;

        const scale_points = matrix_manip.scale_a_matrix(converted_value, origin);

        const x = center_point.x;
        const y = center_point.y;
        const z = center_point.z; 

        const final = matrix_manip.translate_a_matrix(x,y,z,scale_points);

        shape.points = final;
        shape.setPoints();

        await new Promise(r => setTimeout(r, 1));
    }

    timer.init(1000);
    converter.init(100);
    percent_time = 0;
    converted_value = 0;
    points = shape.points;

    while(1)
    {
        if ( percent_time >= 1 ) break;

        percent_time = timer.get_percent_time();
        converted_value = converter.convert_time_into_value(percent_time,1);

        if ( converted_value <=1 ) continue;

        const tranlate_points = matrix_manip.translate_a_matrix(converted_value,0,0, points);

        shape.points = tranlate_points;
        shape.setPoints();

        await new Promise(r => setTimeout(r, 1));
    }
}

main();